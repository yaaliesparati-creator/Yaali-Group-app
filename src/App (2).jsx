import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ─── FIREBASE ────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDIDyq4rVA_kdAFmTNORsl2tiRBd6vd5gU",
  authDomain: "yaali-group.firebaseapp.com",
  projectId: "yaali-group",
  storageBucket: "yaali-group.firebasestorage.app",
  messagingSenderId: "170079353903",
  appId: "1:170079353903:web:314c2c832052aaf9909ada",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function fbLoad(key, fallback) {
  try {
    const snap = await getDoc(doc(db, "yaali", key));
    return snap.exists() ? snap.data().value : fallback;
  } catch { return fallback; }
}
async function fbSave(key, value) {
  try { await setDoc(doc(db, "yaali", key), { value }); } catch (e) { console.error(e); }
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  teal:   "#1A6B6B", tealDk: "#0F4444", tealLt: "#2A8A8A",
  gold:   "#C9A84C", goldLt: "#E8C96A",
  white:  "#FFFFFF", offWht: "#F7F9F8",
  gray50: "#F0F4F3", gray100:"#D8E3E3", gray400:"#7A9696", gray700:"#2C3E3E",
  red:    "#C0392B",
};

const BUSINESSES = ["inmobiliaria", "studio", "hyg"];
const BIZ_META = {
  inmobiliaria: { label:"Yaali Inmobiliaria", icon:"🏠", color:C.teal,   desc:"Compra, venta y renta de inmuebles" },
  studio:       { label:"Yaali Studio",       icon:"🎨", color:C.tealDk, desc:"Marketing & Diseño" },
  hyg:          { label:"HYG Asesorías",      icon:"📋", color:C.gold,   desc:"Asesorías Mejoravit" },
};

// ─── SEED DATA ───────────────────────────────────────────────────
const seedClientes = {
  inmobiliaria: [
    { id:1, nombre:"María González", tel:"8112345678", email:"maria@email.com", notas:"Busca casa 3 recámaras INFONAVIT", fecha:"2025-06-01", status:"Activo" },
    { id:2, nombre:"Carlos Ramírez", tel:"8198765432", email:"carlos@email.com", notas:"Interesado en terreno comercial", fecha:"2025-06-05", status:"Prospecto" },
  ],
  studio: [
    { id:1, nombre:"Ferretería Ramos", tel:"8113334455", email:"ramos@negocio.com", notas:"Campaña redes sociales", fecha:"2025-05-20", status:"Activo" },
  ],
  hyg: [
    { id:1, nombre:"Juan Pérez", tel:"8119876543", email:"juan@email.com", notas:"Mejoravit baño y cocina", fecha:"2025-06-03", status:"En proceso" },
  ],
};
const seedServicios = {
  inmobiliaria: [
    { id:1, nombre:"Asesoría de compra", precio:5000, descripcion:"Acompañamiento INFONAVIT/FOVISSSTE/Bancario", activo:true },
    { id:2, nombre:"Listado de propiedad", precio:2500, descripcion:"Publicación y gestión de venta/renta", activo:true },
  ],
  studio: [
    { id:1, nombre:"Identidad de marca", precio:8000, descripcion:"Logo, paleta, tipografía, manual de uso", activo:true },
    { id:2, nombre:"Gestión de redes", precio:3500, descripcion:"Contenido mensual Instagram y Facebook", activo:true },
    { id:3, nombre:"Diseño de flyer", precio:800, descripcion:"Flyer digital o impreso profesional", activo:true },
  ],
  hyg: [
    { id:1, nombre:"Asesoría Mejoravit", precio:1500, descripcion:"Gestoría completa crédito mejora de vivienda", activo:true },
    { id:2, nombre:"Valuación de mejoras", precio:800, descripcion:"Evaluación de obra para autorización", activo:true },
  ],
};
const seedInventario = [
  { id:1, titulo:"Casa en Cumbres", tipo:"Casa", operacion:"Venta", precio:1850000, direccion:"Cumbres 4to Sector, Monterrey", recamaras:3, banos:2, m2:120, credito:["INFONAVIT","FOVISSSTE","Bancario"], status:"Disponible", notas:"Con jardín y 2 estacionamientos", fotos:[] },
  { id:2, titulo:"Departamento Valle Oriente", tipo:"Departamento", operacion:"Renta", precio:12000, direccion:"Valle Oriente, San Pedro", recamaras:2, banos:2, m2:85, credito:[], status:"Disponible", notas:"Amueblado, piso 5", fotos:[] },
];

// ─── UTILS ───────────────────────────────────────────────────────
const fmt = (n) => n?.toLocaleString("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0});
const newId = (arr) => arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1;

// ─── UI COMPONENTS ───────────────────────────────────────────────
const Badge = ({ text, color=C.teal }) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{text}</span>
);

const Btn = ({ children, onClick, variant="primary", small, disabled, style:sx={} }) => {
  const base = {border:"none",borderRadius:8,cursor:disabled?"not-allowed":"pointer",fontWeight:700,fontFamily:"inherit",transition:"all .15s",opacity:disabled?.5:1,...sx};
  const v = {
    primary:{background:`linear-gradient(135deg,${C.teal},${C.tealDk})`,color:C.white,padding:small?"6px 14px":"10px 22px",fontSize:small?12:14},
    gold:   {background:`linear-gradient(135deg,${C.gold},${C.goldLt})`,color:C.tealDk,padding:small?"6px 14px":"10px 22px",fontSize:small?12:14},
    ghost:  {background:"transparent",color:C.teal,padding:small?"5px 12px":"9px 20px",fontSize:small?12:14,border:`1.5px solid ${C.teal}`},
    danger: {background:"#fee2e2",color:C.red,padding:small?"5px 12px":"9px 20px",fontSize:small?12:14,border:"1.5px solid #fca5a5"},
  };
  return <button onClick={disabled?undefined:onClick} style={{...base,...v[variant]}}>{children}</button>;
};

const inputSt = {border:`1.5px solid ${C.gray100}`,borderRadius:8,padding:"9px 12px",fontSize:14,color:C.gray700,fontFamily:"inherit",outline:"none",background:C.white};

const Input = ({ label, value, onChange, type="text", placeholder, required, options, rows }) => (
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label && <label style={{fontSize:12,fontWeight:700,color:C.gray700,textTransform:"uppercase",letterSpacing:.5}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>}
    {options ? <select value={value} onChange={e=>onChange(e.target.value)} style={inputSt}>{options.map(o=><option key={o}>{o}</option>)}</select>
    : rows   ? <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...inputSt,resize:"vertical"}}/>
    :          <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputSt}/>}
  </div>
);

const Card = ({ children, style:sx={} }) => (
  <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 8px rgba(0,0,0,.07)",padding:16,...sx}}>{children}</div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:C.white,borderRadius:16,width:"100%",maxWidth:480,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.gray100}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.white,zIndex:1}}>
        <span style={{fontWeight:800,fontSize:16,color:C.tealDk}}>{title}</span>
        <button onClick={onClose} style={{background:C.gray50,border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,color:C.gray400}}>×</button>
      </div>
      <div style={{padding:20}}>{children}</div>
    </div>
  </div>
);

const Toast = ({ msg }) => msg ? (
  <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:C.tealDk,color:C.white,padding:"10px 24px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:2000,boxShadow:"0 4px 20px rgba(0,0,0,.3)",whiteSpace:"nowrap"}}>{msg}</div>
) : null;

// ─── FOTO VIEWER ─────────────────────────────────────────────────
function FotoViewer({ fotos, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:"50%",width:36,height:36,fontSize:20,cursor:"pointer"}}>×</button>
      <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0} style={{position:"absolute",left:12,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:"50%",width:40,height:40,fontSize:22,cursor:"pointer",opacity:idx===0?.3:1}}>‹</button>
      <img src={fotos[idx]} style={{maxWidth:"90vw",maxHeight:"80vh",borderRadius:8,objectFit:"contain"}}/>
      <button onClick={()=>setIdx(i=>Math.min(fotos.length-1,i+1))} disabled={idx===fotos.length-1} style={{position:"absolute",right:12,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:"50%",width:40,height:40,fontSize:22,cursor:"pointer",opacity:idx===fotos.length-1?.3:1}}>›</button>
      <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
        {fotos.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===idx?"#fff":"rgba(255,255,255,.4)"}}/>)}
      </div>
    </div>
  );
}

// ─── FOTO UPLOADER ───────────────────────────────────────────────
function FotoUploader({ fotos=[], onChange }) {
  const fileRef = useRef();
  const MAX = 6;
  const handleFiles = (files) => {
    const remaining = MAX - fotos.length;
    Array.from(files).slice(0,remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => onChange(prev=>[...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  };
  const remove = (i) => onChange(prev=>prev.filter((_,idx)=>idx!==i));
  return (
    <div>
      <label style={{fontSize:12,fontWeight:700,color:C.gray700,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:8}}>
        Fotos <span style={{color:C.gray400,fontWeight:400,textTransform:"none"}}>({fotos.length}/{MAX})</span>
      </label>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
        {fotos.map((src,i)=>(
          <div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",background:C.gray50}}>
            <img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <button onClick={()=>remove(i)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.6)",border:"none",color:"#fff",borderRadius:"50%",width:22,height:22,fontSize:13,cursor:"pointer"}}>×</button>
            {i===0&&<div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:9,fontWeight:700,textAlign:"center",padding:"2px 0"}}>PRINCIPAL</div>}
          </div>
        ))}
        {fotos.length<MAX&&(
          <button onClick={()=>fileRef.current.click()} style={{aspectRatio:"1",borderRadius:8,border:`2px dashed ${C.gray100}`,background:C.gray50,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,color:C.gray400}}>
            <span style={{fontSize:22}}>📷</span>
            <span style={{fontSize:10,fontWeight:700}}>Agregar</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{handleFiles(e.target.files);e.target.value="";}}/>
    </div>
  );
}

// ─── SEGUIMIENTO MODAL ───────────────────────────────────────────
const SEGUIMIENTO_TIPOS = ["Llamada","WhatsApp","Visita","Email","Reunión","Otro"];
function SeguimientoModal({ cliente, onClose, onSave }) {
  const [nota, setNota] = useState("");
  const [tipo, setTipo] = useState("WhatsApp");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10));
  const seguimientos = cliente.seguimientos || [];

  const agregar = () => {
    if (!nota.trim()) return;
    const nuevo = { id:newId(seguimientos), tipo, nota, fecha, hora:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}) };
    onSave({ ...cliente, seguimientos:[nuevo,...seguimientos] });
    setNota(""); 
  };

  const tipoIcon = { Llamada:"📞", WhatsApp:"💬", Visita:"🏠", Email:"📧", Reunión:"🤝", Otro:"📝" };

  return (
    <Modal title={`Seguimiento — ${cliente.nombre}`} onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {/* Nuevo seguimiento */}
        <div style={{background:C.gray50,borderRadius:10,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:C.tealDk,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Nuevo registro</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <Input label="Tipo" value={tipo} onChange={setTipo} options={SEGUIMIENTO_TIPOS}/>
            <Input label="Fecha" value={fecha} onChange={setFecha} type="date"/>
          </div>
          <Input label="Nota" value={nota} onChange={setNota} placeholder="Ej. Cliente interesado, pide más info..." rows={2}/>
          <div style={{marginTop:8}}>
            <Btn onClick={agregar} variant="primary" disabled={!nota.trim()} style={{width:"100%"}}>+ Registrar</Btn>
          </div>
        </div>

        {/* Historial */}
        <div style={{fontSize:12,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:.5}}>
          Historial ({seguimientos.length})
        </div>
        {seguimientos.length===0 && <div style={{textAlign:"center",color:C.gray400,padding:20,fontSize:13}}>Sin seguimientos aún</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:280,overflowY:"auto"}}>
          {seguimientos.map(s=>(
            <div key={s.id} style={{background:C.white,borderRadius:8,padding:"10px 12px",border:`1px solid ${C.gray100}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:700,color:C.tealDk}}>{tipoIcon[s.tipo]} {s.tipo}</span>
                <span style={{fontSize:11,color:C.gray400}}>{s.fecha} {s.hora}</span>
              </div>
              <div style={{fontSize:13,color:C.gray700}}>{s.nota}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ─── STATUS OPTIONS ───────────────────────────────────────────────
const STATUS_CLIENTE = ["Prospecto","Activo","En seguimiento","Cerrado","Inactivo"];
const STATUS_INMO    = ["Disponible","Apartado","Vendido","Rentado"];
const TIPOS_INMO     = ["Casa","Departamento","Terreno","Local Comercial","Oficina"];
const OPS_INMO       = ["Venta","Renta","Venta y Renta"];
const CREDITOS       = ["INFONAVIT","FOVISSSTE","Bancario","Contado"];

// ═══════════════════════════════════════════════════════════════════
// CLIENTES MODULE
// ═══════════════════════════════════════════════════════════════════
function ClientesModule({ clientes, onChange, toast }) {
  const [modal, setModal] = useState(null);
  const [seguimientoCliente, setSeguimientoCliente] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [form, setForm] = useState({ nombre:"", tel:"", email:"", notas:"", fecha:new Date().toISOString().slice(0,10), status:"Prospecto", seguimientos:[] });

  const filtered = clientes.filter(c => {
    const ms = c.nombre.toLowerCase().includes(search.toLowerCase()) || c.tel?.includes(search);
    const mf = filterStatus==="Todos" || c.status===filterStatus;
    return ms && mf;
  });

  const openNew = () => { setForm({nombre:"",tel:"",email:"",notas:"",fecha:new Date().toISOString().slice(0,10),status:"Prospecto",seguimientos:[]}); setModal("new"); };
  const openEdit = (c) => { setForm({...c}); setModal(c.id); };

  const saveForm = () => {
    if (!form.nombre.trim()) return;
    const updated = modal==="new" ? [...clientes,{...form,id:newId(clientes)}] : clientes.map(c=>c.id===modal?{...form,id:modal}:c);
    onChange(updated); setModal(null); toast(modal==="new"?"Cliente agregado ✓":"Cliente actualizado ✓");
  };
  const del = (id) => { onChange(clientes.filter(c=>c.id!==id)); toast("Cliente eliminado"); };

  const saveSeguimiento = (clienteActualizado) => {
    const updated = clientes.map(c=>c.id===clienteActualizado.id?clienteActualizado:c);
    onChange(updated); setSeguimientoCliente(clienteActualizado); toast("Seguimiento registrado ✓");
  };

  const statusColor = { Prospecto:C.gold, Activo:C.teal, "En seguimiento":"#8e44ad", Cerrado:C.gray400, Inactivo:"#e74c3c" };
  const FILTERS = ["Todos",...STATUS_CLIENTE];

  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{...inputSt,flex:1}}/>
        <Btn onClick={openNew} variant="gold" small>+ Agregar</Btn>
      </div>

      {/* Filtros de status */}
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {FILTERS.map(f=>(
          <button key={f} onClick={()=>setFilterStatus(f)} style={{border:"none",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",background:filterStatus===f?C.teal:C.gray50,color:filterStatus===f?C.white:C.gray400}}>{f}</button>
        ))}
      </div>

      <div style={{fontSize:12,color:C.gray400,marginBottom:10}}>{filtered.length} clientes</div>
      {filtered.length===0&&<div style={{textAlign:"center",color:C.gray400,padding:40}}>Sin clientes.</div>}

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(c=>(
          <Card key={c.id} style={{padding:"12px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15,color:C.tealDk,marginBottom:2}}>{c.nombre}</div>
                <div style={{fontSize:12,color:C.gray400}}>{c.tel}{c.email?` · ${c.email}`:""}</div>
                {c.notas&&<div style={{fontSize:12,color:C.gray700,marginTop:4,background:C.gray50,borderRadius:6,padding:"4px 8px"}}>{c.notas}</div>}
                <div style={{marginTop:6,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                  <Badge text={c.status} color={statusColor[c.status]||C.gray400}/>
                  <span style={{fontSize:11,color:C.gray400}}>{c.fecha}</span>
                  {c.seguimientos?.length>0&&<span style={{fontSize:11,color:"#8e44ad",fontWeight:700}}>💬 {c.seguimientos.length} seguimientos</span>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <Btn onClick={()=>setSeguimientoCliente(c)} variant="ghost" small>💬</Btn>
                <Btn onClick={()=>openEdit(c)} variant="ghost" small>✏️</Btn>
                <Btn onClick={()=>del(c.id)} variant="danger" small>🗑</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {modal&&(
        <Modal title={modal==="new"?"Nuevo Cliente":"Editar Cliente"} onClose={()=>setModal(null)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input label="Nombre completo" required value={form.nombre} onChange={v=>setForm({...form,nombre:v})} placeholder="Ej. María González"/>
            <Input label="Teléfono" value={form.tel} onChange={v=>setForm({...form,tel:v})} placeholder="81XXXXXXXX" type="tel"/>
            <Input label="Email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="correo@ejemplo.com" type="email"/>
            <Input label="Fecha" value={form.fecha} onChange={v=>setForm({...form,fecha:v})} type="date"/>
            <Input label="Status" value={form.status} onChange={v=>setForm({...form,status:v})} options={STATUS_CLIENTE}/>
            <Input label="Notas" value={form.notas} onChange={v=>setForm({...form,notas:v})} placeholder="Observaciones..." rows={3}/>
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <Btn onClick={saveForm} variant="primary" style={{flex:1}} disabled={!form.nombre.trim()}>Guardar</Btn>
              <Btn onClick={()=>setModal(null)} variant="ghost">Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}

      {seguimientoCliente&&(
        <SeguimientoModal
          cliente={seguimientoCliente}
          onClose={()=>setSeguimientoCliente(null)}
          onSave={saveSeguimiento}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SERVICIOS MODULE
// ═══════════════════════════════════════════════════════════════════
function ServiciosModule({ servicios, onChange, toast }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({nombre:"",precio:"",descripcion:"",activo:true});

  const openNew = () => { setForm({nombre:"",precio:"",descripcion:"",activo:true}); setModal("new"); };
  const openEdit = (s) => { setForm({...s,precio:String(s.precio)}); setModal(s.id); };

  const saveForm = () => {
    if (!form.nombre.trim()) return;
    const entry = {...form,precio:Number(form.precio)||0};
    const updated = modal==="new" ? [...servicios,{...entry,id:newId(servicios)}] : servicios.map(s=>s.id===modal?{...entry,id:modal}:s);
    onChange(updated); setModal(null); toast("Servicio guardado ✓");
  };
  const del = (id) => { onChange(servicios.filter(s=>s.id!==id)); toast("Servicio eliminado"); };
  const toggle = (id) => onChange(servicios.map(s=>s.id===id?{...s,activo:!s.activo}:s));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <Btn onClick={openNew} variant="gold" small>+ Agregar servicio</Btn>
      </div>
      {servicios.length===0&&<div style={{textAlign:"center",color:C.gray400,padding:40}}>Sin servicios.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {servicios.map(s=>(
          <Card key={s.id} style={{padding:"12px 16px",opacity:s.activo?1:.6}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:15,color:C.tealDk}}>{s.nombre}</div>
                <div style={{fontSize:13,color:C.gold,fontWeight:700,marginTop:2}}>{fmt(s.precio)}</div>
                {s.descripcion&&<div style={{fontSize:12,color:C.gray700,marginTop:4}}>{s.descripcion}</div>}
                <div style={{marginTop:6}}><Badge text={s.activo?"Activo":"Inactivo"} color={s.activo?C.teal:C.gray400}/></div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <Btn onClick={()=>toggle(s.id)} variant="ghost" small>{s.activo?"⏸":"▶"}</Btn>
                <Btn onClick={()=>openEdit(s)} variant="ghost" small>✏️</Btn>
                <Btn onClick={()=>del(s.id)} variant="danger" small>🗑</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {modal&&(
        <Modal title={modal==="new"?"Nuevo Servicio":"Editar Servicio"} onClose={()=>setModal(null)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input label="Nombre del servicio" required value={form.nombre} onChange={v=>setForm({...form,nombre:v})} placeholder="Ej. Diseño de logo"/>
            <Input label="Precio (MXN)" value={form.precio} onChange={v=>setForm({...form,precio:v})} placeholder="0" type="number"/>
            <Input label="Descripción" value={form.descripcion} onChange={v=>setForm({...form,descripcion:v})} rows={3} placeholder="Qué incluye..."/>
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <Btn onClick={saveForm} variant="primary" style={{flex:1}} disabled={!form.nombre.trim()}>Guardar</Btn>
              <Btn onClick={()=>setModal(null)} variant="ghost">Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// INVENTARIO MODULE
// ═══════════════════════════════════════════════════════════════════
function InventarioModule({ inventario, onChange, toast }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [viewer, setViewer] = useState(null);
  const [formFotos, setFormFotos] = useState([]);
  const emptyForm = {titulo:"",tipo:"Casa",operacion:"Venta",precio:"",direccion:"",recamaras:"",banos:"",m2:"",credito:[],status:"Disponible",notas:""};
  const [form, setForm] = useState(emptyForm);

  const filtered = inventario.filter(p=>{
    const mf = filter==="Todos"||p.status===filter||p.operacion===filter;
    const ms = p.titulo?.toLowerCase().includes(search.toLowerCase())||p.direccion?.toLowerCase().includes(search.toLowerCase());
    return mf&&ms;
  });

  const openNew = () => { setForm(emptyForm); setFormFotos([]); setModal("new"); };
  const openEdit = (p) => { setForm({...p,precio:String(p.precio),recamaras:String(p.recamaras),banos:String(p.banos),m2:String(p.m2)}); setFormFotos(p.fotos||[]); setModal(p.id); };

  const saveForm = () => {
    if (!form.titulo.trim()) return;
    const entry = {...form,precio:Number(form.precio)||0,recamaras:Number(form.recamaras)||0,banos:Number(form.banos)||0,m2:Number(form.m2)||0,fotos:formFotos};
    const updated = modal==="new" ? [...inventario,{...entry,id:newId(inventario)}] : inventario.map(p=>p.id===modal?{...entry,id:modal}:p);
    onChange(updated); setModal(null); toast("Propiedad guardada ✓");
  };
  const del = (id) => { onChange(inventario.filter(p=>p.id!==id)); toast("Propiedad eliminada"); };
  const toggleCredito = (cr) => { const l=form.credito||[]; setForm({...form,credito:l.includes(cr)?l.filter(x=>x!==cr):[...l,cr]}); };

  const statusColor = {Disponible:C.teal,Apartado:C.gold,Vendido:C.gray400,Rentado:"#8e44ad"};
  const FILTERS = ["Todos","Disponible","Venta","Renta","Apartado","Vendido"];

  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar propiedad..." style={{...inputSt,flex:1}}/>
        <Btn onClick={openNew} variant="gold" small>+ Agregar</Btn>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {FILTERS.map(f=><button key={f} onClick={()=>setFilter(f)} style={{border:"none",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",background:filter===f?C.teal:C.gray50,color:filter===f?C.white:C.gray400}}>{f}</button>)}
      </div>
      <div style={{fontSize:12,color:C.gray400,marginBottom:10}}>{filtered.length} propiedades</div>
      {filtered.length===0&&<div style={{textAlign:"center",color:C.gray400,padding:40}}>Sin propiedades.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(p=>(
          <Card key={p.id} style={{padding:0,overflow:"hidden"}}>
            {p.fotos?.length>0 ? (
              <div style={{position:"relative",height:180,background:C.gray100,cursor:"pointer"}} onClick={()=>setViewer({fotos:p.fotos,idx:0})}>
                <img src={p.fotos[0]} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.6)",color:"#fff",borderRadius:12,padding:"3px 10px",fontSize:11,fontWeight:700}}>📷 {p.fotos.length}</div>
                <div style={{position:"absolute",top:8,left:8}}><Badge text={p.status} color={statusColor[p.status]||C.teal}/></div>
              </div>
            ) : (
              <div style={{height:60,background:`linear-gradient(135deg,${C.teal}22,${C.teal}11)`,display:"flex",alignItems:"center",justifyContent:"center",color:C.gray400,fontSize:13,gap:6}}>
                <span style={{fontSize:20}}>🏠</span> Sin fotos
              </div>
            )}
            <div style={{padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontWeight:800,fontSize:15,color:C.tealDk}}>{p.titulo}</span>
                    {!p.fotos?.length&&<Badge text={p.status} color={statusColor[p.status]||C.teal}/>}
                    <Badge text={p.operacion} color={C.tealLt}/>
                  </div>
                  <div style={{fontSize:20,fontWeight:900,color:C.gold,marginBottom:4}}>{fmt(p.precio)}{p.operacion==="Renta"?"/mes":""}</div>
                  <div style={{fontSize:12,color:C.gray400,marginBottom:6}}>📍 {p.direccion}</div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:12,color:C.gray700,marginBottom:6}}>
                    {p.tipo&&<span>🏷 {p.tipo}</span>}
                    {p.recamaras>0&&<span>🛏 {p.recamaras} rec.</span>}
                    {p.banos>0&&<span>🚿 {p.banos} baños</span>}
                    {p.m2>0&&<span>📐 {p.m2} m²</span>}
                  </div>
                  {p.credito?.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{p.credito.map(cr=><Badge key={cr} text={cr} color={C.tealDk}/>)}</div>}
                  {p.notas&&<div style={{fontSize:11,color:C.gray400,marginTop:6}}>{p.notas}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginLeft:8}}>
                  <Btn onClick={()=>openEdit(p)} variant="ghost" small>✏️</Btn>
                  <Btn onClick={()=>del(p.id)} variant="danger" small>🗑</Btn>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {modal&&(
        <Modal title={modal==="new"?"Nueva Propiedad":"Editar Propiedad"} onClose={()=>setModal(null)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <FotoUploader fotos={formFotos} onChange={setFormFotos}/>
            <div style={{borderTop:`1px solid ${C.gray100}`,paddingTop:14}}>
              <Input label="Título" required value={form.titulo} onChange={v=>setForm({...form,titulo:v})} placeholder="Ej. Casa en Cumbres"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Input label="Tipo" value={form.tipo} onChange={v=>setForm({...form,tipo:v})} options={TIPOS_INMO}/>
              <Input label="Operación" value={form.operacion} onChange={v=>setForm({...form,operacion:v})} options={OPS_INMO}/>
            </div>
            <Input label="Precio (MXN)" value={form.precio} onChange={v=>setForm({...form,precio:v})} placeholder="0" type="number"/>
            <Input label="Dirección" value={form.direccion} onChange={v=>setForm({...form,direccion:v})} placeholder="Colonia, Ciudad"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <Input label="Recámaras" value={form.recamaras} onChange={v=>setForm({...form,recamaras:v})} type="number"/>
              <Input label="Baños" value={form.banos} onChange={v=>setForm({...form,banos:v})} type="number"/>
              <Input label="m²" value={form.m2} onChange={v=>setForm({...form,m2:v})} type="number"/>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:700,color:C.gray700,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:6}}>Crédito aceptado</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {CREDITOS.map(cr=><button key={cr} onClick={()=>toggleCredito(cr)} style={{border:`1.5px solid ${form.credito?.includes(cr)?C.teal:C.gray100}`,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",background:form.credito?.includes(cr)?C.teal+"22":C.white,color:form.credito?.includes(cr)?C.teal:C.gray400}}>{cr}</button>)}
              </div>
            </div>
            <Input label="Status" value={form.status} onChange={v=>setForm({...form,status:v})} options={STATUS_INMO}/>
            <Input label="Notas" value={form.notas} onChange={v=>setForm({...form,notas:v})} rows={2} placeholder="Características adicionales..."/>
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <Btn onClick={saveForm} variant="primary" style={{flex:1}} disabled={!form.titulo.trim()}>Guardar</Btn>
              <Btn onClick={()=>setModal(null)} variant="ghost">Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}
      {viewer&&<FotoViewer fotos={viewer.fotos} startIdx={viewer.idx} onClose={()=>setViewer(null)}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function Dashboard({ data }) {
  const stats = BUSINESSES.map(biz=>({
    ...BIZ_META[biz], biz,
    clientes:  data.clientes[biz]?.length||0,
    prospectos:data.clientes[biz]?.filter(c=>c.status==="Prospecto").length||0,
    activos:   data.clientes[biz]?.filter(c=>c.status==="Activo").length||0,
    servicios: data.servicios[biz]?.filter(s=>s.activo).length||0,
  }));
  const inmoTotal = data.inventario?.length||0;
  const inmoDisp  = data.inventario?.filter(p=>p.status==="Disponible").length||0;
  const inmoVal   = data.inventario?.filter(p=>p.status==="Disponible"&&p.operacion==="Venta").reduce((a,p)=>a+(p.precio||0),0)||0;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:`linear-gradient(135deg,${C.tealDk},${C.teal})`,borderRadius:16,padding:"24px 20px",color:C.white,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,borderRadius:"50%",background:C.gold+"22"}}/>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:2,opacity:.7,marginBottom:4}}>YAALI GROUP</div>
        <div style={{fontSize:26,fontWeight:900,marginBottom:2}}>Panel General</div>
        <div style={{fontSize:13,opacity:.8}}>• Encuentra Tu Lugar •</div>
        <div style={{marginTop:12,background:"rgba(255,255,255,.1)",borderRadius:8,padding:"8px 12px",fontSize:12,display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:16}}>🔥</span> Datos sincronizados en Firebase
        </div>
      </div>

      {stats.map(s=>(
        <Card key={s.biz} style={{borderLeft:`4px solid ${s.color}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{s.icon} {s.label}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[{label:"Total",val:s.clientes},{label:"Prospectos",val:s.prospectos},{label:"Activos",val:s.activos},{label:"Servicios",val:s.servicios}].map(x=>(
              <div key={x.label} style={{background:C.gray50,borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:900,color:s.color}}>{x.val}</div>
                <div style={{fontSize:10,color:C.gray400}}>{x.label}</div>
              </div>
            ))}
          </div>
          {s.biz==="inmobiliaria"&&(
            <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{label:"Inventario",val:inmoTotal},{label:"Disponibles",val:inmoDisp},{label:"Valor venta",val:inmoVal>0?(inmoVal/1000000).toFixed(1)+"M":"0"}].map(x=>(
                <div key={x.label} style={{background:C.gold+"15",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:900,color:C.gold}}>{x.val}</div>
                  <div style={{fontSize:11,color:C.gray400}}>{x.label}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [ready, setReady] = useState(false);
  const [nav, setNav] = useState("dashboard");
  const [tab, setTab] = useState("clientes");
  const [data, setData] = useState({ clientes:{}, servicios:{}, inventario:[] });
  const [toastMsg, setToastMsg] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(()=>{
    (async()=>{
      const clientes={}, servicios={};
      for (const biz of BUSINESSES) {
        clientes[biz] = await fbLoad(`clientes_${biz}`, seedClientes[biz]);
        servicios[biz] = await fbLoad(`servicios_${biz}`, seedServicios[biz]);
      }
      const inventario = await fbLoad("inventario", seedInventario);
      setData({clientes,servicios,inventario});
      setReady(true);
    })();
  },[]);

  const toast = (msg) => { setToastMsg(msg); setTimeout(()=>setToastMsg(""),2500); };

  const updateClientes = async (biz,list) => {
    setSyncing(true);
    const n={...data,clientes:{...data.clientes,[biz]:list}};
    setData(n);
    await fbSave(`clientes_${biz}`, list);
    setSyncing(false);
  };
  const updateServicios = async (biz,list) => {
    setSyncing(true);
    const n={...data,servicios:{...data.servicios,[biz]:list}};
    setData(n);
    await fbSave(`servicios_${biz}`, list);
    setSyncing(false);
  };
  const updateInventario = async (list) => {
    setSyncing(true);
    setData({...data,inventario:list});
    await fbSave("inventario", list);
    setSyncing(false);
  };

  if (!ready) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.tealDk},${C.teal})`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{width:56,height:56,border:`4px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <div style={{color:C.white,fontWeight:700,letterSpacing:2}}>YAALI GROUP</div>
      <div style={{color:C.gold,fontSize:12}}>Conectando a Firebase...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const BIZ_TABS = nav==="inmobiliaria" ? ["clientes","servicios","inventario"] : ["clientes","servicios"];

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.offWht,minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${C.tealDk},${C.teal})`,padding:"16px 20px 14px",position:"sticky",top:0,zIndex:100}}>
        {nav==="dashboard" ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${C.gold}`,background:C.white+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏡</div>
              <div>
                <div style={{color:C.white,fontWeight:900,fontSize:17,lineHeight:1.1}}>Yaali Group</div>
                <div style={{color:C.gold,fontSize:10,fontWeight:600,letterSpacing:1}}>ENCUENTRA TU LUGAR</div>
              </div>
            </div>
            {syncing&&<div style={{color:C.gold,fontSize:11,fontWeight:700}}>⟳ Guardando...</div>}
          </div>
        ) : (
          <div>
            <button onClick={()=>setNav("dashboard")} style={{background:"none",border:"none",color:C.gold,fontWeight:700,fontSize:12,cursor:"pointer",padding:0,marginBottom:6}}>← Inicio</button>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:C.white,fontWeight:900,fontSize:17}}>{BIZ_META[nav].icon} {BIZ_META[nav].label}</div>
              {syncing&&<div style={{color:C.gold,fontSize:11,fontWeight:700}}>⟳ Guardando...</div>}
            </div>
            <div style={{display:"flex",gap:6,marginTop:10}}>
              {BIZ_TABS.map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{border:"none",borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer",background:tab===t?C.gold:C.white+"20",color:tab===t?C.tealDk:C.white}}>
                  {t==="inventario"?"🏠 Inventario":t==="clientes"?"👥 Clientes":"📦 Servicios"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{padding:"16px 16px 0"}}>
        {nav==="dashboard"&&<Dashboard data={data}/>}
        {nav!=="dashboard"&&tab==="clientes"&&<ClientesModule clientes={data.clientes[nav]||[]} onChange={list=>updateClientes(nav,list)} toast={toast}/>}
        {nav!=="dashboard"&&tab==="servicios"&&<ServiciosModule servicios={data.servicios[nav]||[]} onChange={list=>updateServicios(nav,list)} toast={toast}/>}
        {nav==="inmobiliaria"&&tab==="inventario"&&<InventarioModule inventario={data.inventario} onChange={updateInventario} toast={toast}/>}
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.white,borderTop:`1px solid ${C.gray100}`,display:"flex",zIndex:99}}>
        {[{key:"dashboard",label:"Inicio",icon:"🏠"},{key:"inmobiliaria",label:"Inmobiliaria",icon:"🏡"},{key:"studio",label:"Studio",icon:"🎨"},{key:"hyg",label:"HYG",icon:"📋"}].map(item=>(
          <button key={item.key} onClick={()=>{setNav(item.key);setTab("clientes");}} style={{flex:1,border:"none",background:"none",padding:"10px 4px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{fontSize:nav===item.key?22:18,transition:"font-size .15s"}}>{item.icon}</div>
            <div style={{fontSize:10,fontWeight:700,color:nav===item.key?C.teal:C.gray400}}>{item.label}</div>
            {nav===item.key&&<div style={{width:20,height:3,borderRadius:2,background:C.teal}}/>}
          </button>
        ))}
      </div>

      <Toast msg={toastMsg}/>
    </div>
  );
}
