import React, { useMemo, useState } from "react";
import {
  Search, Heart, Scale, Moon, Sun, SlidersHorizontal, Menu, X, Bell, User,
  ChevronRight, Gauge, Fuel, Settings2, MapPin, CalendarDays, Zap, CarFront,
  Mail, Phone, CheckCircle2, Upload, ArrowRight, LogOut, Globe, ShieldCheck
} from "lucide-react";
import { cars } from "./data";

const money = n => "$" + n.toLocaleString();
const bodies = ["All","Sedan","SUV","Coupe"];
const fuels = ["All","Petrol","Hybrid","Electric"];

function App() {
  const [dark,setDark] = useState(() => localStorage.getItem("aurex-theme")==="dark");
  const [query,setQuery] = useState("");
  const [body,setBody] = useState("All");
  const [fuel,setFuel] = useState("All");
  const [brand,setBrand] = useState("All");
  const [maxPrice,setMaxPrice] = useState(200000);
  const [sort,setSort] = useState("featured");
  const [favorites,setFavorites] = useState(() => JSON.parse(localStorage.getItem("aurex-favorites")||"[]"));
  const [compare,setCompare] = useState([]);
  const [selected,setSelected] = useState(null);
  const [modal,setModal] = useState(null);
  const [menu,setMenu] = useState(false);
  const [toast,setToast] = useState("");
  const [notifications,setNotifications] = useState(2);
  const [signedIn,setSignedIn] = useState(() => localStorage.getItem("aurex-signed-in")==="true");
  const [accountName,setAccountName] = useState(() => localStorage.getItem("aurex-account-name") || "Ozma");
  const [accountEmail,setAccountEmail] = useState(() => localStorage.getItem("aurex-account-email") || "");
  const [settingsNotifications,setSettingsNotifications] = useState(() => localStorage.getItem("aurex-notifications") !== "false");

  const brands = ["All",...new Set(cars.map(c=>c.make))];

  const notify = msg => {
    setToast(msg);
    setTimeout(()=>setToast(""),2800);
  };
  const go = id => {
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setMenu(false);
  };
  const toggleTheme = () => {
    const next=!dark;
    setDark(next);
    localStorage.setItem("aurex-theme",next?"dark":"light");
  };
  const toggleFavorite = id => {
    const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];
    setFavorites(next);
    localStorage.setItem("aurex-favorites",JSON.stringify(next));
    notify(next.includes(id)?"Saved to favorites":"Removed from favorites");
  };
  const toggleCompare = id => {
    if(compare.includes(id)) setCompare(compare.filter(x=>x!==id));
    else if(compare.length<3) setCompare([...compare,id]);
    else notify("You can compare up to 3 vehicles.");
  };

  const filtered = useMemo(()=>{
    let list=cars.filter(c=>{
      const text=[c.make,c.model,c.body,c.fuel,c.color,c.year,c.badge].join(" ").toLowerCase();
      return (!query || text.includes(query.toLowerCase()))
        && (body==="All"||c.body===body)
        && (fuel==="All"||c.fuel===fuel)
        && (brand==="All"||c.make===brand)
        && c.price<=maxPrice;
    });
    if(sort==="price-low") list.sort((a,b)=>a.price-b.price);
    if(sort==="price-high") list.sort((a,b)=>b.price-a.price);
    if(sort==="mileage") list.sort((a,b)=>a.mileage-b.mileage);
    if(sort==="newest") list.sort((a,b)=>b.year-a.year);
    return list;
  },[query,body,fuel,brand,maxPrice,sort]);

  const openTestDrive = car => { setSelected(car); setModal("test"); };
  const submit = (e,message) => {
    e.preventDefault(); setModal(null); notify(message);
  };

  return (
    <div className={dark?"app dark":"app"}>
      <header className="nav">
        <button className="brand brand-btn" onClick={()=>go("home")} aria-label="Aurex home">
          <div className="brand-mark">A</div><div><strong>AUREX</strong><span>MOTORS</span></div>
        </button>
        <nav className={menu?"nav-links open":"nav-links"}>
          <button onClick={()=>go("home")}>Home</button>
          <button onClick={()=>go("inventory")}>Inventory</button>
          <button onClick={()=>go("services")}>Services</button>
          <button onClick={()=>go("about")}>About</button>
          <button onClick={()=>go("contact")}>Contact</button>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">{dark?<Sun/>:<Moon/>}</button>
          <button className="icon-btn notification-btn" onClick={()=>{setModal("notifications");setNotifications(0)}} title="Notifications"><Bell/>{notifications>0&&<i>{notifications}</i>}</button>
          <button className="account-btn" onClick={()=>setModal("account")}><User/> <span>{signedIn ? accountName : "Sign in"}</span></button>
          <button className="menu-btn icon-btn" onClick={()=>setMenu(!menu)}><Menu/></button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">A MODERN WAY TO MOVE</p>
            <h1>Find a car that<br/><em>feels like yours.</em></h1>
            <p className="hero-text">Explore carefully selected vehicles from everyday essentials to extraordinary performance machines.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={()=>go("inventory")}>Explore inventory <ArrowRight/></button>
              <button className="secondary-btn" onClick={()=>setModal("sell")}>Sell your car</button>
            </div>
            <div className="hero-stats"><span><b>24+</b> curated vehicles</span><span><b>4</b> vehicle categories</span><span><b>100%</b> digital experience</span></div>
          </div>
          <div className="hero-visual">
           <div
  className="hero-image"
  style={{
    backgroundImage: "url('https://www.dubicars.com/images/e297bf/w_1300x760/laith-el-obeidi/f7c808d3-2665-4fe1-ae80-4b83d17a986f.jpg')"
  }}
></div>
            <div className="floating-card"><span>FEATURED</span><b>Mercedes-AMG G 63</b><strong>$189,000</strong><button onClick={()=>setSelected(cars[16])}>View vehicle <ChevronRight/></button></div>
          </div>
        </section>

        <section className="search-panel">
          <div className="search-box"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search make, model, body type..." /></div>
          <select value={body} onChange={e=>setBody(e.target.value)}>{bodies.map(x=><option key={x}>{x}</option>)}</select>
          <select value={fuel} onChange={e=>setFuel(e.target.value)}>{fuels.map(x=><option key={x}>{x}</option>)}</select>
          <button className="filter-btn" onClick={()=>setModal("filters")}><SlidersHorizontal/> Filters</button>
        </section>

        <section className="section" id="inventory">
          <div className="section-head">
            <div><p className="eyebrow">THE COLLECTION</p><h2>Vehicles worth <em>discovering.</em></h2></div>
            <div className="sort-wrap"><span>{filtered.length} vehicles</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="mileage">Lowest Mileage</option></select></div>
          </div>
          <div className="category-row">
            <button className={body==="All"?"active":""} onClick={()=>setBody("All")}>All vehicles</button>
            <button className={fuel==="Electric"?"active":""} onClick={()=>{setFuel("Electric");setBody("All")}}>Electric</button>
            <button onClick={()=>{setBrand("BMW");setFuel("All");setBody("All")}}>BMW</button>
            <button onClick={()=>{setBrand("Mercedes-AMG");setFuel("All");setBody("All")}}>Performance</button>
            <button onClick={()=>{setBrand("All");setBody("SUV")}}>Family SUVs</button>
          </div>
          <div className="car-grid">
            {filtered.map(car=>(
              <article className="car-card" key={car.id}>
                <div className="car-image">
                  <button className="car-image-button" onClick={()=>setSelected(car)} aria-label={`View details for ${car.make} ${car.model}`}>
                    <img src={car.image} alt={`${car.make} ${car.model}`} onError={e=>e.currentTarget.style.visibility="hidden"}/>
                  </button>
                  <span className="badge">{car.badge}</span>
                  <div className="car-image-tools">
                  <span className="image-hint">View vehicle</span>
                  <div className="card-tools">
                    <button className={favorites.includes(car.id)?"selected icon-btn":"icon-btn"} onClick={()=>toggleFavorite(car.id)} title="Favorite"><Heart fill={favorites.includes(car.id)?"currentColor":"none"}/></button>
                    <button className={compare.includes(car.id)?"selected icon-btn":"icon-btn"} onClick={()=>toggleCompare(car.id)} title="Compare"><Scale/></button>
                  </div>
                </div>
                </div>
                <div className="car-info">
                  <div className="car-title"><div><span>{car.year} · {car.body}</span><button className="car-name-btn" onClick={()=>setSelected(car)}>{car.make} {car.model}</button></div><strong>{money(car.price)}</strong></div>
                  <div className="spec-row"><span><Gauge/> {car.mileage.toLocaleString()} mi</span><span><Fuel/> {car.fuel}</span><span><Settings2/> {car.transmission}</span></div>
                  <div className="card-actions"><button className="text-btn" onClick={()=>setSelected(car)}>View details <ChevronRight/></button><button className="primary-mini" onClick={()=>openTestDrive(car)}>Test drive</button></div>
                </div>
              </article>
            ))}
          </div>
          {!filtered.length&&<div className="empty"><h3>No vehicles found.</h3><p>Try a different search or reset the filters.</p><button className="secondary-btn" onClick={()=>{setQuery("");setBody("All");setFuel("All");setBrand("All");setMaxPrice(200000)}}>Reset filters</button></div>}
        </section>

        <section className="experience" id="services">
          <div className="experience-intro"><p className="eyebrow">A BETTER WAY TO SHOP</p><h2>More than a dealership.<br/><em>Your automotive home.</em></h2><p>Every action is designed to make researching, comparing and contacting a dealership feel simple.</p><button className="secondary-btn" onClick={()=>setModal("financing")}>Explore financing</button></div>
          <div className="feature-grid">
            <button onClick={()=>go("inventory")}><span>01</span><CarFront/><h3>Wide selection</h3><p>From practical daily drivers to rare performance cars.</p></button>
            <button onClick={()=>setModal("compare")}><span>02</span><Scale/><h3>Compare vehicles</h3><p>Put up to three cars side by side before deciding.</p></button>
            <button onClick={()=>setModal("test")}><span>03</span><CalendarDays/><h3>Book a test drive</h3><p>Choose a convenient date and experience your next car.</p></button>
            <button onClick={()=>setModal("service")}><span>04</span><Zap/><h3>Digital services</h3><p>Financing, trade-ins, inquiries and support in one place.</p></button>
          </div>
        </section>

        <section className="about section" id="about">
          <div className="about-image"></div>
          <div><p className="eyebrow">ABOUT AUREX</p><h2>Premium choices.<br/><em>Clear decisions.</em></h2><p> AUREX Motors is a portfolio-ready automotive marketplace concept focused on clean discovery, useful vehicle information and fast digital actions.</p><div className="about-points"><span><ShieldCheck/> Transparent vehicle information</span><span><Globe/> Designed for a global audience</span><span><Zap/> Fast, responsive interactions</span></div><button className="primary-btn" onClick={()=>go("contact")}>Talk to AUREX <ArrowRight/></button></div>
        </section>

        <section className="cta" id="contact">
          <p className="eyebrow">READY FOR THE NEXT DRIVE?</p><h2>Your next car is<br/><em>closer than you think.</em></h2>
          <div className="cta-actions"><button className="primary-btn" onClick={()=>go("inventory")}>Browse vehicles <ChevronRight/></button><button className="secondary-btn" onClick={()=>setModal("contact")}>Contact us</button></div>
        </section>
      </main>

      {compare.length>0&&<div className="compare-bar"><b>{compare.length} selected</b><div>{compare.map(id=>{const c=cars.find(x=>x.id===id);return <span key={id}>{c.make} {c.model}</span>})}</div><button onClick={()=>setModal("compare")}>Compare</button><button className="clear-btn" onClick={()=>setCompare([])}>Clear</button></div>}

      {selected&&modal!=="test"&&<Modal title={`${selected.make} ${selected.model}`} onClose={()=>setSelected(null)}><img className="modal-car-image" src={selected.image} alt=""/><p className="eyebrow">{selected.year} · {selected.badge}</p><h2>{selected.make} {selected.model}</h2><strong className="modal-price">{money(selected.price)}</strong><p>{selected.description}</p><div className="modal-specs"><span><b>Engine</b>{selected.engine}</span><span><b>Power</b>{selected.power}</span><span><b>Drive</b>{selected.drive}</span><span><b>Mileage</b>{selected.mileage.toLocaleString()} mi</span></div><button className="primary-btn full" onClick={()=>setModal("test")}>Book a test drive <CalendarDays/></button></Modal>}

      {modal==="test"&&<Modal title="Book a test drive" onClose={()=>{setModal(null);setSelected(null)}}><form onSubmit={e=>submit(e,"Test-drive request submitted successfully.")}><label>Vehicle<select defaultValue={selected?selected.id:""}>{selected&&<option value={selected.id}>{selected.make} {selected.model}</option>}{!selected&&cars.slice(0,8).map(c=><option key={c.id} value={c.id}>{c.make} {c.model}</option>)}</select></label><div className="form-grid"><label>Full name<input required placeholder="Your name"/></label><label>Email<input required type="email" placeholder="you@example.com"/></label></div><div className="form-grid"><label>Date<input required type="date"/></label><label>Preferred time<select><option>10:00 AM</option><option>1:00 PM</option><option>4:00 PM</option></select></label></div><button className="primary-btn full">Confirm test drive <CalendarDays/></button></form></Modal>}

      {modal==="settings"&&<Modal title="Account settings" onClose={()=>setModal(null)}>
        <form onSubmit={e=>{e.preventDefault(); const name=e.currentTarget.fullName.value.trim(); const email=e.currentTarget.email.value.trim(); const notifications=e.currentTarget.notifications.checked; setAccountName(name); setAccountEmail(email); setSettingsNotifications(notifications); localStorage.setItem("aurex-account-name",name); localStorage.setItem("aurex-account-email",email); localStorage.setItem("aurex-notifications",String(notifications)); setModal(null); notify("Your settings have been saved.");}}>
          <label>Full name<input name="fullName" required defaultValue={accountName}/></label>
          <label>Email<input name="email" required type="email" defaultValue={accountEmail}/></label>
          <label className="setting-toggle"><input name="notifications" type="checkbox" defaultChecked={settingsNotifications}/> <span>Receive AUREX notifications</span></label>
          <div className="settings-theme"><span>Appearance</span><div><button type="button" className="secondary-btn" onClick={()=>setDark(false)}><Sun/> Light</button><button type="button" className="secondary-btn" onClick={()=>setDark(true)}><Moon/> Dark</button></div></div>
          <button className="primary-btn full">Save changes <Settings2/></button>
        </form>
      </Modal>}
      {modal==="account"&&<Modal title={signedIn ? `Welcome back, ${accountName}` : "Welcome to AUREX"} onClose={()=>setModal(null)}>
        {signedIn ? <div className="account-dashboard">
          <div className="profile-card"><div className="profile-avatar"><User/></div><div><strong>{accountName}</strong><span>Verified AUREX member</span></div></div>
          <div className="account-menu"><button onClick={()=>{setModal(null);notify(`${favorites.length} saved vehicle${favorites.length===1?"":"s"} in your account.`)}}><Heart/> Saved vehicles <span>{favorites.length}</span></button><button onClick={()=>{setModal(null);notify("Your dashboard is ready.")}}><Gauge/> My dashboard <ChevronRight/></button><button onClick={()=>setModal("settings")}><Settings2/> Settings <ChevronRight/></button></div>
          <button className="secondary-btn full" onClick={()=>{setSignedIn(false);localStorage.removeItem("aurex-signed-in");localStorage.removeItem("aurex-account-name");localStorage.removeItem("aurex-account-email");setAccountEmail("");setModal(null);notify("You have been signed out.")}}><LogOut/> Sign out</button>
        </div> : <form onSubmit={e=>{e.preventDefault(); const name=e.currentTarget.fullName.value.trim(); const email=e.currentTarget.email.value.trim(); setAccountName(name); setAccountEmail(email); setSignedIn(true); localStorage.setItem("aurex-signed-in","true"); localStorage.setItem("aurex-account-name",name); localStorage.setItem("aurex-account-email",email); setModal(null); notify(`Welcome to AUREX, ${name}! You are now signed in.`);}}>
          <label>Full name<input name="fullName" required type="text" placeholder="Your full name"/></label><label>Email<input name="email" required type="email" placeholder="you@example.com"/></label><label>Password<input name="password" required type="password" placeholder="••••••••"/></label><button className="primary-btn full">Create account & sign in <User/></button>
        </form>}
        {!signedIn&&<div className="modal-note">Demo sign-in for this portfolio project. A production version can connect Supabase, Firebase or Auth0 for secure authentication.</div>}
      </Modal>}

      {modal==="contact"&&<Modal title="Contact AUREX" onClose={()=>setModal(null)}><form onSubmit={e=>submit(e,"Message sent. AUREX will respond shortly.")}><div className="form-grid"><label>Name<input required placeholder="Your name"/></label><label>Email<input required type="email" placeholder="you@example.com"/></label></div><label>Subject<input required placeholder="How can we help?"/></label><label>Message<textarea required rows="5" placeholder="Write your message..."/></label><button className="primary-btn full">Send message <Mail/></button></form></Modal>}

      {modal==="sell"&&<Modal title="Sell or trade your car" onClose={()=>setModal(null)}><form onSubmit={e=>submit(e,"Your vehicle submission has been received.")}><div className="form-grid"><label>Make<input required placeholder="Toyota"/></label><label>Model<input required placeholder="Camry"/></label></div><div className="form-grid"><label>Year<input required type="number" min="1990" max="2026"/></label><label>Mileage<input required type="number" placeholder="25000"/></label></div><label>Estimated price<input type="number" placeholder="30000"/></label><label className="upload"><Upload/>Vehicle photos / documents<input type="file" multiple accept="image/*,.pdf"/></label><button className="primary-btn full">Submit vehicle <ArrowRight/></button></form></Modal>}

      {modal==="financing"&&<Modal title="Financing options" onClose={()=>setModal(null)}><form onSubmit={e=>submit(e,"Financing request submitted.")}><label>Vehicle budget<input type="number" placeholder="45000"/></label><div className="form-grid"><label>Employment<select><option>Full time</option><option>Part time</option><option>Self employed</option></select></label><label>Term<select><option>36 months</option><option>48 months</option><option>60 months</option></select></label></div><button className="primary-btn full">Check options <ArrowRight/></button></form></Modal>}

      {modal==="service"&&<Modal title="AUREX digital services" onClose={()=>setModal(null)}><div className="service-list"><button onClick={()=>setModal("test")}><CalendarDays/> Book a test drive <ChevronRight/></button><button onClick={()=>setModal("financing")}><ShieldCheck/> Explore financing <ChevronRight/></button><button onClick={()=>setModal("sell")}><Upload/> Sell or trade your car <ChevronRight/></button><button onClick={()=>setModal("contact")}><Mail/> Contact support <ChevronRight/></button></div></Modal>}

      {modal==="filters"&&<Modal title="Advanced filters" onClose={()=>setModal(null)}><label>Brand<select value={brand} onChange={e=>setBrand(e.target.value)}>{brands.map(b=><option key={b}>{b}</option>)}</select></label><label>Maximum price: {money(maxPrice)}<input type="range" min="15000" max="200000" step="5000" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/></label><div className="filter-chips">{bodies.map(b=><button className={body===b?"active":""} onClick={()=>setBody(b)} key={b}>{b}</button>)}</div><button className="primary-btn full" onClick={()=>setModal(null)}>Apply filters</button></Modal>}

      {modal==="compare"&&<Modal title="Compare vehicles" onClose={()=>setModal(null)}>{compare.length<2?<div className="empty-modal"><p>Select at least two vehicles using the scale icon.</p><button className="secondary-btn" onClick={()=>{setModal(null);go("inventory")}}>Choose vehicles</button></div>:<div className="compare-table">{compare.map(id=>{const c=cars.find(x=>x.id===id);return <div key={id}><img src={c.image} alt=""/><h3>{c.make} {c.model}</h3><strong>{money(c.price)}</strong><span>{c.year} · {c.mileage.toLocaleString()} mi</span><span>{c.engine}</span><span>{c.power}</span><span>{c.drive}</span></div>})}</div>}</Modal>}

      {modal==="notifications"&&<Modal title="Notifications" onClose={()=>setModal(null)}><div className="notifications"><div><CheckCircle2/><span><b>Welcome to AUREX</b> Your saved vehicle tools are ready.</span></div><div><Bell/><span><b>New inventory</b> Premium vehicles were added to the collection.</span></div></div></Modal>}

      <footer><div className="footer-top"><div className="brand"><div className="brand-mark">A</div><div><strong>AUREX</strong><span>MOTORS</span></div></div><p>Premium vehicles. Transparent choices. Better journeys.</p><div className="footer-links"><button onClick={()=>go("about")}>About</button><button onClick={()=>go("services")}>Services</button><button onClick={()=>setModal("contact")}>Contact</button><button onClick={()=>setModal("sell")}>Sell your car</button></div></div><div className="footer-bottom"><span>© 2026 AUREX Motors. Demo portfolio project.</span><span>Frontend demo • Backend-ready architecture</span></div></footer>
      {toast&&<div className="toast"><CheckCircle2/>{toast}</div>}
    </div>
  );
}

function Modal({title,onClose,children}) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close icon-btn" onClick={onClose}><X/></button><p className="eyebrow">AUREX MOTORS</p><h2>{title}</h2>{children}</div></div>;
}
export default App;