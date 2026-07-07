import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
from src.drift_detection import calculate_psi, ks_test_drift


def test_psi_zero_when_identical_distribution():
    """PSI harus mendekati 0 kalau 2 distribusi persis sama."""
    data = np.random.normal(100, 10, 1000)
    psi = calculate_psi(data, data.copy())
    assert psi < 0.05


def test_psi_high_when_shifted_distribution():
    """PSI harus tinggi kalau ada shift signifikan antar distribusi."""
    expected = np.random.normal(100, 10, 1000)
    actual = np.random.normal(150, 10, 1000)  # shift besar
    psi = calculate_psi(expected, actual)
    assert psi > 0.25


def test_ks_test_no_drift_same_distribution():
    """KS-test tidak boleh mendeteksi drift kalau distribusi sama."""
    np.random.seed(42)
    data1 = np.random.normal(100, 10, 1000)
    data2 = np.random.normal(100, 10, 1000)
    result = ks_test_drift(data1, data2)
    assert result["is_drift_detected"] == False


def test_ks_test_detects_drift_different_distribution():
    """KS-test harus mendeteksi drift kalau distribusi jelas beda."""
    np.random.seed(42)
    data1 = np.random.normal(100, 10, 1000)
    data2 = np.random.normal(130, 10, 1000)
    result = ks_test_drift(data1, data2)
    assert result["is_drift_detected"] == True