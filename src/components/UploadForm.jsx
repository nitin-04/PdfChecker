import { useState } from 'react';
import axios from 'axios';
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [rules, setRules] = useState(['', '', '']);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const onRuleChange = (idx, val) => {
    const r = [...rules];
    r[idx] = val;
    setRules(r);
  };

  const submit = async () => {
    if (!file) return alert('Please upload a PDF.');
    if (rules.some((r) => !r.trim()))
      return alert('Please fill in all 3 rules.');

    const fd = new FormData();
    fd.append('pdf', file);
    fd.append('rules', JSON.stringify(rules));

    try {
      setLoading(true);
      const resp = await axios.post('/api/check', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(resp.data.results);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Checker</h1>
          <p className="mt-2 text-gray-600">
            Upload a PDF and set rules to verify content.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF
              </label>
              <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  {file ? (
                    <FileText className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {file ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">Ready to scan</p>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validation Rules
              </label>
              <div className="space-y-3">
                {rules.map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-none flex items-center justify-center w-8 h-10 text-sm font-medium text-gray-400">
                      {i + 1}.
                    </span>
                    <input
                      value={r}
                      onChange={(e) => onRuleChange(i, e.target.value)}
                      placeholder={`e.g. "Document must mention a date"`}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Document'
              )}
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Results</h3>
            {results.map((r, idx) => (
              <div
                key={idx}
                className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                  r.status === 'pass' ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {r.status === 'pass' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <h4 className="font-medium text-gray-900">{r.rule}</h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                      r.status === 'pass'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{r.reasoning}</p>

                {r.evidence && (
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 border border-gray-100 italic">
                    " {r.evidence} "
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    Confidence: {r.confidence}%
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        r.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${r.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
