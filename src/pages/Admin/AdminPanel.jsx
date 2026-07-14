import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://portfolio-fuaq.onrender.com/api/portfolio';
const AUTO_REFRESH_MS = 60000; // auto-refresh every 60 seconds

const TABS = [
  { id: 'projects',     icon: '🚀', label: 'Projects' },
  { id: 'certificates', icon: '🎓', label: 'Certificates' },
  { id: 'internships',  icon: '💼', label: 'Internships' },
  { id: 'skills',       icon: '⚡', label: 'Skills' },
  { id: 'overview',     icon: '🌐', label: 'Overview' },
];

/* ─── Toast ─────────────────────────────────────── */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', top: '2rem', right: '2rem', left: '2rem',
      maxWidth: '400px', margin: '0 auto', zIndex: 10000,
      padding: '1.25rem 1.5rem', borderRadius: '16px',
      background: toast.type === 'success' ? 'var(--accent)' : '#ef4444',
      color: 'white', fontWeight: 700, fontSize: '0.95rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', gap: '1rem',
      animation: 'toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{ fontSize: '1.25rem' }}>{toast.type === 'success' ? '✨' : '⚠️'}</span> {toast.msg}
    </div>
  );
}

/* ─── Spinner ────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3.5px solid #1e293b', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500 }}>Updating live data...</p>
    </div>
  );
}

/* ─── Field helpers ──────────────────────────────── */
const fieldStyle = {
  width: '100%', padding: '0.8rem 1rem', borderRadius: '0.5rem',
  border: '1.5px solid #334155', background: '#0f172a', color: '#f8fafc',
  fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'all 0.2s ease',
};

function Field({ label, required, children }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <Field label={label} required={required}>
      <input type={type} value={value || ''} onChange={onChange} placeholder={placeholder || label}
        required={required} className="input-field" />
    </Field>
  );
}

function Textarea({ label, value, onChange, placeholder, required, rows = 4 }) {
  return (
    <Field label={label} required={required}>
      <textarea value={value || ''} onChange={onChange} placeholder={placeholder || label}
        required={required} rows={rows} className="input-field"
        style={{ resize: 'vertical', minHeight: `${rows * 1.5}rem` }} />
    </Field>
  );
}

/* ─── Main Component ─────────────────────────────── */
export default function AdminPanel() {
  const [activeTab, setActiveTab]   = useState('projects');
  const [data, setData]             = useState([]);
  const [form, setForm]             = useState({});
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [toast, setToast]           = useState(null);
  const [mobileNav, setMobileNav]   = useState(false);
  const [showForm, setShowForm]     = useState(false); // Mobile toggle
  const [lastRefresh, setLastRefresh] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');
  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  useEffect(() => {
    if (!token) navigate('/admin');
  }, [token, navigate]);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${activeTab}`);
      if (activeTab === 'overview') {
        setData([res.data]);
        if (!form._id) setForm(res.data || {});
      } else {
        setData(res.data);
      }
      setLastRefresh(new Date());
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [activeTab, token, navigate, form._id]);

  useEffect(() => {
    setForm({});
    setShowForm(false);
    fetchData();
  }, [activeTab]); // eslint-disable-line

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?\nThis cannot be undone.`)) return;
    try {
      await axios.delete(`${API_URL}/${activeTab}/${id}`, { headers: { Authorization: token } });
      showToast('Deleted successfully');
      fetchData();
    } catch { showToast('Delete failed', 'error'); }
  };

  const handleEdit = (item) => {
    const d = { ...item };
    const arrayFields = ['technologies', 'toolsUsed'];
    if (activeTab === 'projects') arrayFields.push('category');

    arrayFields.forEach(f => {
      if (Array.isArray(d[f])) d[f] = d[f].join(', ');
    });
    setForm(d);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const config = { headers: { Authorization: token } };
    const submitData = { ...form };
    const arrayFields = ['technologies', 'toolsUsed'];
    if (activeTab === 'projects') arrayFields.push('category');

    arrayFields.forEach(f => {
      if (typeof submitData[f] === 'string') {
        submitData[f] = submitData[f].split(',').map(s => s.trim()).filter(Boolean);
      }
    });

    try {
      if (activeTab === 'overview') {
        await axios.put(`${API_URL}/overview`, submitData, config);
        showToast('Site overview updated! 🌐');
      } else if (submitData._id) {
        await axios.put(`${API_URL}/${activeTab}/${submitData._id}`, submitData, config);
        showToast('Updated successfully!');
      } else {
        await axios.post(`${API_URL}/${activeTab}`, submitData, config);
        showToast('New record added!');
      }
      setForm({});
      setShowForm(false);
      fetchData();
    } catch (err) {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}/upload`, fd, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' },
      });
      setForm(prev => ({ ...prev, image: res.data.imageUrl }));
      showToast('Image uploaded to cloud! ☁️');
    } catch { showToast('Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const f = (field) => form[field] || '';
  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const renderFormFields = () => {
    switch (activeTab) {
      case 'projects': return (<>
        <Input label="Title" value={f('title')} onChange={set('title')} required />
        <Textarea label="Description" value={f('description')} onChange={set('description')} required rows={3} />
        <Input label="GitHub URL" value={f('github')} onChange={set('github')} />
        <Input label="Live URL" value={f('live')} onChange={set('live')} />
        <Input label="Technologies (split by comma)" value={f('technologies')} onChange={set('technologies')} placeholder="React, Node.js" />
        <Input label="Category" value={f('category')} onChange={set('category')} placeholder="react, javascript" />
        <ImageField form={form} setForm={setForm} onUpload={handleImageUpload} uploading={uploading} />
      </>);
      case 'certificates': return (<>
        <Input label="Certificate Name" value={f('name')} onChange={set('name')} required />
        <Input label="Issuer" value={f('issuer')} onChange={set('issuer')} required />
        <Input label="PDF URL" value={f('pdf')} onChange={set('pdf')} />
        <Input label="Badge URL" value={f('badgeLink')} onChange={set('badgeLink')} />
        <ImageField form={form} setForm={setForm} onUpload={handleImageUpload} uploading={uploading} />
      </>);
      case 'internships': return (<>
        <Input label="Company" value={f('company')} onChange={set('company')} required />
        <Input label="Role" value={f('role')} onChange={set('role')} required />
        <Textarea label="Description" value={f('description')} onChange={set('description')} rows={3} />
        <ImageField form={form} setForm={setForm} onUpload={handleImageUpload} uploading={uploading} />
      </>);
      case 'skills': return (<>
        <Input label="Category" value={f('category')} onChange={set('category')} required />
        <Textarea label="Skills (split by comma)" value={f('technologies')} onChange={set('technologies')} required rows={2} />
      </>);
      case 'overview': return (<>
        <Input label="Hero Title" value={f('heroTitle')} onChange={set('heroTitle')} />
        <Input label="Hero Subtitle" value={f('heroSubtitle')} onChange={set('heroSubtitle')} />
        <Textarea label="About Me Text" value={f('aboutMeText')} onChange={set('aboutMeText')} rows={5} />
        <Input label="CV / Resume URL" value={f('cvUrl')} onChange={set('cvUrl')} />
        <Input label="Tools Used (split by comma)" value={f('toolsUsed')} onChange={set('toolsUsed')} />
      </>);
      default: return null;
    }
  };

  const tabInfo = TABS.find(t => t.id === activeTab);
  const itemLabel = (item) => item.title || item.name || item.company || item.category || 'Untitled';
  const itemSub   = (item) => item.issuer || item.role || item.description || (Array.isArray(item.technologies) ? item.technologies.join(', ') : '') || '';

  return (
    <div className="admin-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --primary: #3b82f6;
          --primary-hover: #2563eb;
          --bg-deep: #020617;
          --bg-card: #0f172a;
          --bg-sidebar: #0b1120;
          --accent: #10b981;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border: #1e293b;
          --glass: rgba(15, 23, 42, 0.7);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastIn { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } }

        * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .admin-layout { 
          display: grid; 
          grid-template-columns: 280px 1fr; 
          height: 100vh; 
          overflow: hidden;
          background: var(--bg-deep) !important;
          color: var(--text-main);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        }

        .sidebar { 
          background: var(--bg-sidebar); 
          border-right: 1px solid var(--border); 
          padding: 2rem 1.25rem; 
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 100;
        }

        .main-container {
          display: grid;
          grid-template-columns: 480px 1fr;
          height: calc(100vh - 80px);
          overflow: hidden;
        }

        .form-section {
          background: rgba(8, 15, 30, 0.5);
          backdrop-filter: blur(10px);
          border-right: 1px solid var(--border);
          padding: 3rem 2.5rem;
          overflow-y: auto;
        }

        .content-section {
          padding: 3rem;
          overflow-y: auto;
          background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 40%);
        }

        .tab-btn { 
          width: 100%; 
          display: flex; 
          align-items: center; 
          gap: 1rem; 
          padding: 0.9rem 1.25rem; 
          border: none; 
          border-radius: 12px; 
          background: transparent; 
          color: var(--text-muted); 
          font-weight: 600; 
          cursor: pointer; 
          transition: 0.3s; 
          text-align: left; 
        }

        .tab-btn.active { 
          background: linear-gradient(135deg, var(--primary), #1d4ed8); 
          color: #fff; 
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .tab-btn:hover:not(.active) { 
          background: rgba(30, 41, 59, 0.5); 
          color: var(--text-main); 
        }

        .card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          margin-bottom: 1rem;
          transition: 0.3s;
          animation: fadeIn 0.4s ease forwards;
        }

        .card:hover { border-color: var(--primary); transform: translateY(-4px); }

        .btn-action {
          padding: 0.6rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
        }

        .btn-edit { background: rgba(59, 130, 246, 0.1); color: var(--primary); }
        .btn-delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .form-group { margin-bottom: 2rem; }
        .form-label { 
          display: block; 
          font-size: 0.8rem; 
          font-weight: 700; 
          color: var(--text-muted); 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          margin-bottom: 0.75rem; 
        }

        .input-field {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: 2px solid var(--border);
          background: rgba(15, 23, 42, 0.6);
          color: white;
          font-size: 1rem;
          transition: 0.3s;
          outline: none;
        }

        .input-field:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }

        .btn-save {
          width: 100%;
          padding: 1.1rem;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, var(--primary), #1d4ed8);
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn-save:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5); }

        .header {
          height: 80px;
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          width: 100%;
        }

        .mobile-only { display: none !important; }
        .desktop-only { display: block !important; }

        .btn-fab {
          display: none;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #1d4ed8);
          color: white;
          border: none;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
          font-size: 2rem;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn-fab:hover { transform: scale(1.1); }
        .btn-fab:active { transform: scale(0.9); }

        @media (max-width: 1200px) {
          .mobile-only { display: flex !important; }
          .desktop-only { display: none !important; }
          .admin-layout { grid-template-columns: 1fr; }
          .sidebar { 
            position: fixed; 
            inset: 0; 
            transform: translateX(-100%); 
            transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 100000;
          }
          .sidebar.open { transform: translateX(0); }
          .main-container { grid-template-columns: 1fr; height: calc(100vh - 80px); }
          .form-section { 
            display: none; 
            position: fixed; 
            inset: 0; 
            top: 0;
            background: var(--bg-deep);
            z-index: 100010;
            padding-top: 2rem;
          }
          .form-section.open { display: block; animation: slideIn 0.4s ease; height: 100vh; }
          .btn-fab { 
            display: flex !important; 
            align-items: center; 
            justify-content: center; 
            position: fixed; 
            bottom: 2rem; 
            right: 2rem; 
            z-index: 100005; 
          }
          .content-section { padding: 1.5rem; }
          .header { padding: 0 1.25rem; }
        }

        @media (max-width: 640px) {
          .card { 
            flex-direction: column; 
            align-items: stretch; 
            gap: 1rem;
            padding: 1rem;
          }
          .card img { width: 100% !important; height: 180px !important; }
          .item-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; width: 100%; }
          .item-actions .btn-action { width: 100%; justify-content: center; padding: 0.8rem; }
          
          .header h2 { font-size: 1.1rem; }
          .header p { font-size: 0.7rem; }
          .btn-save { padding: 1rem; }
          .form-section { padding: 2rem 1.5rem 5rem; }
        }
      `}</style>
      
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* --- Sidebar --- */}
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div style={{ padding: '0 0.75rem 2rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '10px', display: 'flex' }}>⚡</span>
            Admin Panel
          </h1>
        </div>
        
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 1rem 0.75rem' }}>Management</p>
          {TABS.map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => { setActiveTab(tab.id); setMobileNav(false); }}>
              <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', padding: '1.5rem 1rem', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></span>
            Server: Connected
          </p>
          <button onClick={handleLogout} style={{ marginTop: '1rem', width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.6rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }} onMouseEnter={e => e.target.style.background = '#ef4444'} onMouseLeave={e => e.target.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#ef4444'}>Log Out</button>
        </div>
      </aside>

      {/* --- Main Dashboard --- */}
      <main style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setMobileNav(!mobileNav)} className="mobile-only" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.6rem', borderRadius: '10px', cursor: 'pointer', color: '#fff' }}>☰</button>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tabInfo?.label}</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Manage your portfolio {activeTab.toLowerCase()}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="desktop-only" style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Last Refreshed</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{lastRefresh?.toLocaleTimeString() || 'Just now'}</p>
            </div>
            <button onClick={() => fetchData()} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>Refresh</button>
          </div>
        </header>

        <div className="main-container">
          {/* Form Pane */}
          <section className={`form-section ${showForm ? 'open' : ''}`}>
            {showForm && window.innerWidth <= 1200 && (
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--border)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>✕</button>
            )}
            
            <div style={{ marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '2rem' }}>{form._id ? '✍️' : '✨'}</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem' }}>
                {form._id ? 'Edit Content' : 'Create New'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill in the details below to update your live site.</p>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {/* Field, Input, and Textarea already use input-field class via the props I'll update below */}
                {renderFormFields()}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="submit" disabled={saving} className="btn-save">
                  {saving ? 'Saving Changes...' : 'Save and Publish'}
                </button>
                {form._id && (
                  <button type="button" onClick={() => { setForm({}); setShowForm(false); }} style={{ padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>Cancel</button>
                )}
              </div>
            </form>
          </section>

          {/* List Pane */}
          <section className="content-section">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Live Stream ({data.length})
              </h3>
            </div>

            {loading ? <Spinner /> : data.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '6rem 0', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📭</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No records yet</h4>
                <p style={{ color: 'var(--text-muted)' }}>Start by creating your first entry on the left.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {data.map((item, idx) => (
                  <div key={item._id} className="card" style={{ animationDelay: `${idx * 0.05}s` }}>
                    {item.image ? (
                      <img src={item.image} alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--border)' }} />
                    ) : (
                      <div style={{ width: '70px', height: '70px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '2px solid rgba(59, 130, 246, 0.2)' }}>
                        {tabInfo.icon}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem', color: '#fff', wordBreak: 'break-word' }}>{itemLabel(item)}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', wordBreak: 'break-word' }}>{itemSub(item)}</div>
                    </div>
                    <div className="item-actions" style={{ alignSelf: 'flex-start' }}>
                      <button onClick={() => handleEdit(item)} className="btn-action btn-edit" title="Edit Item" style={{ minWidth: '40px' }}>✏️</button>
                      {activeTab !== 'overview' && (
                        <button onClick={() => handleDelete(item._id, itemLabel(item))} className="btn-action btn-delete" title="Delete Item" style={{ minWidth: '40px' }}>🗑️</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      {activeTab !== 'overview' && !showForm && (
        <button className="btn-fab" onClick={() => { setForm({}); setShowForm(true); }}>+</button>
      )}
    </div>
  );
}

/* ─── Image Field ────────────────────────────────── */
function ImageField({ form, setForm, onUpload, uploading }) {
  return (
    <Field label="Cloud Media (Image)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" value={form.image || ''} placeholder="Paste URL or upload..."
          onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
          className="input-field" />
        
        <label style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', 
          padding: '1rem', borderRadius: '12px', background: uploading ? 'var(--border)' : 'rgba(59, 130, 246, 0.1)', 
          color: uploading ? 'var(--text-muted)' : 'var(--primary)', 
          border: '2px dashed var(--primary)',
          cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.95rem',
          transition: '0.3s'
        }} onMouseEnter={e => !uploading && (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)')} 
           onMouseLeave={e => !uploading && (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)')}>
          {uploading ? '⏳ Sending to Cloudinary...' : '☁️ Drag & Drop or Click to Upload'}
          <input type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
        
        {form.image && (
          <div style={{ 
            marginTop: '0.5rem', borderRadius: '16px', overflow: 'hidden', 
            border: '2px solid var(--border)', background: '#000', 
            maxHeight: '200px', display: 'flex', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}>
            <img src={form.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
          </div>
        )}
      </div>
    </Field>
  );
}
