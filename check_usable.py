import pandas as pd

df = pd.read_excel('data/anonymized_growth_data.xlsx')
counts = df['anon_id'].value_counts()
usable = counts[counts >= 5]

print(f'Anak dengan >=5 pengukuran (layak untuk forecasting): {len(usable)} dari {len(counts)}')

usable_ids = usable.index
filtered = df[df['anon_id'].isin(usable_ids)]
print(f'Total baris data yang akan dipakai: {len(filtered)}')