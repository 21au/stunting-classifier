import pandas as pd
from prophet import Prophet

METRIC_CONFIG = {
    "berat": {"cap": 30, "floor": 0, "label": "Berat Badan (kg)"},
    "tinggi": {"cap": 130, "floor": 30, "label": "Tinggi Badan (cm)"},
    "lingkar_kepala": {"cap": 55, "floor": 25, "label": "Lingkar Kepala (cm)"},
}


def load_longitudinal_data(filepath: str = "data/anonymized_growth_data.xlsx") -> pd.DataFrame:
    df = pd.read_excel(filepath)
    df["tanggal_ukur"] = pd.to_datetime(df["tanggal_ukur"])
    return df


def get_available_children(df: pd.DataFrame) -> list[dict]:
    """
    Daftar anak (anonim) yang punya cukup data untuk forecasting,
    dipakai untuk dropdown pilihan di dashboard.
    """
    summary = df.groupby("anon_id").agg(
        jumlah_pengukuran=("tanggal_ukur", "count"),
        jenis_kelamin=("jenis_kelamin", "first"),
        tanggal_awal=("tanggal_ukur", "min"),
        tanggal_akhir=("tanggal_ukur", "max"),
    ).reset_index()

    summary = summary[summary["jumlah_pengukuran"] >= 5]
    summary["tanggal_awal"] = summary["tanggal_awal"].dt.strftime("%Y-%m-%d")
    summary["tanggal_akhir"] = summary["tanggal_akhir"].dt.strftime("%Y-%m-%d")

    return summary.to_dict(orient="records")


def prepare_prophet_dataframe(df: pd.DataFrame, anon_id: str, metric: str) -> pd.DataFrame:
    """Siapkan data 1 anak dalam format yang dibutuhkan Prophet: kolom 'ds' dan 'y'."""
    child_df = df[df["anon_id"] == anon_id][["tanggal_ukur", metric]].dropna()
    child_df = child_df.rename(columns={"tanggal_ukur": "ds", metric: "y"})
    child_df = child_df.sort_values("ds").drop_duplicates(subset="ds")
    return child_df


def forecast_growth(anon_id: str, metric: str, periods_months: int = 3, filepath: str = "data/anonymized_growth_data.xlsx") -> dict:
    """
    Forecast pertumbuhan 1 anak untuk 1 metrik tertentu (berat/tinggi/lingkar_kepala),
    menggunakan parameter yang direplikasi dari penelitian tugas akhir penulis.
    """
    if metric not in METRIC_CONFIG:
        raise ValueError(f"Metric harus salah satu dari: {list(METRIC_CONFIG.keys())}")

    config = METRIC_CONFIG[metric]
    df = load_longitudinal_data(filepath)
    prophet_df = prepare_prophet_dataframe(df, anon_id, metric)

    if len(prophet_df) < 5:
        raise ValueError(f"Data historis tidak cukup untuk anak ini (hanya {len(prophet_df)} titik).")

    prophet_df["cap"] = config["cap"]
    prophet_df["floor"] = config["floor"]

    model = Prophet(
        growth="logistic",
        changepoint_prior_scale=0.005,
        changepoint_range=0.8,
        interval_width=0.95,
    )
    model.fit(prophet_df)

    future = model.make_future_dataframe(periods=periods_months, freq="MS")
    future["cap"] = config["cap"]
    future["floor"] = config["floor"]

    forecast = model.predict(future)

    historical = prophet_df[["ds", "y"]].copy()
    historical["ds"] = historical["ds"].dt.strftime("%Y-%m-%d")
    historical = historical.rename(columns={"y": "actual"}).to_dict(orient="records")

    forecast_result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].copy()
    forecast_result["ds"] = forecast_result["ds"].dt.strftime("%Y-%m-%d")
    forecast_result = forecast_result.round(2).to_dict(orient="records")

    return {
        "anon_id": anon_id,
        "metric": metric,
        "metric_label": config["label"],
        "historical": historical,
        "forecast": forecast_result,
    }


if __name__ == "__main__":
    df = load_longitudinal_data()
    children = get_available_children(df)
    print(f"Total anak dengan data cukup: {len(children)}")
    print("Contoh 3 anak pertama:", children[:3])

    sample_id = children[0]["anon_id"]
    result = forecast_growth(sample_id, "tinggi", periods_months=3)
    print(f"\nForecast untuk {sample_id}:")
    print(f"Jumlah data historis: {len(result['historical'])}")
    print(f"Jumlah titik forecast: {len(result['forecast'])}")
    print("3 titik forecast terakhir:", result["forecast"][-3:])