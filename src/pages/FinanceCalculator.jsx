import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../components/common/Toast";

export default function FinanceCalculator() {
  const location = useLocation();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const toast = useToast();

  const [carPrice, setCarPrice] = useState(location.state?.price || 45000);
  const [downPayment, setDownPayment] = useState(9000);
  const [rate, setRate] = useState(7.5);
  const [months, setMonths] = useState(48);
  const [saved, setSaved] = useState([]);

  const { emi, totalPayment, totalInterest, loanAmount } = useMemo(() => {
    const principal = Math.max(carPrice - downPayment, 0);
    const monthlyRate = rate / 100 / 12;
    const n = months;
    const m = monthlyRate === 0
      ? principal / n
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    return {
      emi: m || 0,
      totalPayment: (m || 0) * n,
      totalInterest: (m || 0) * n - principal,
      loanAmount: principal,
    };
  }, [carPrice, downPayment, rate, months]);

  const handleSave = () => {
    if (!isAuthenticated) {
      toast?.("Log in to save EMI calculations", "error");
      return;
    }
    setSaved((s) => [{ id: Date.now(), carPrice, downPayment, rate, months, emi }, ...s]);
    toast?.("EMI calculation saved", "success");
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Plan ahead</span>
            <h1 className="fs-h1">Finance calculator</h1>
          </div>
        </div>

        <div className="finance-layout">
          <div className="card finance-form">
            <div className="field">
              <label>Car Price · <span className="mono">${carPrice.toLocaleString()}</span></label>
              <input type="range" min="10000" max="120000" step="500" value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Down Payment · <span className="mono">${downPayment.toLocaleString()}</span></label>
              <input type="range" min="0" max={carPrice} step="500" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Interest Rate · <span className="mono">{rate}%</span></label>
              <input type="range" min="1" max="20" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Loan Duration · <span className="mono">{months} months</span></label>
              <input type="range" min="12" max="84" step="6" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleSave}>Save This Calculation</button>
          </div>

          <div className="finance-result card">
            <span className="eyebrow">Monthly Payment</span>
            <span className="mono emi-value">${emi.toFixed(2)}</span>
            <div className="emi-breakdown mono">
              <div className="flex-between"><span className="text-muted">Loan Amount</span><span>${loanAmount.toLocaleString()}</span></div>
              <div className="flex-between"><span className="text-muted">Total Interest</span><span>${totalInterest.toFixed(0)}</span></div>
              <div className="flex-between"><span className="text-muted">Total Payment</span><span>${totalPayment.toFixed(0)}</span></div>
            </div>
            <div className="gauge-bar">
              <div className="gauge-bar-fill" style={{ width: `${Math.min((loanAmount / totalPayment) * 100, 100)}%` }} />
            </div>
            <span className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>Principal vs. interest share of total payment</span>
          </div>
        </div>

        {saved.length > 0 && (
          <div className="section">
            <div className="section-head"><h2>Saved calculations</h2></div>
            <div className="grid grid-3">
              {saved.map((s) => (
                <div className="card" key={s.id} style={{ padding: 20 }}>
                  <span className="mono" style={{ fontSize: "1.25rem" }}>${s.emi.toFixed(2)}/mo</span>
                  <p className="text-muted mono" style={{ fontSize: "var(--fs-xs)", marginTop: 8 }}>
                    ${s.carPrice.toLocaleString()} · {s.rate}% · {s.months}mo
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
