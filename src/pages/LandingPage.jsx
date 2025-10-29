import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const files = ["sample1.jpg","sample2.jpg","sample3.jpg","sample4.jpg","sample5.jpg","sample6.jpg"];

export default function LandingPage(){
  const [i,setI]=useState(0);
  const imgs = useMemo(()=>files.map(f=>`/images/${f}`),[]);
  useEffect(()=>{
    const t = setInterval(()=>setI(v=>(v+1)%imgs.length), 3000);
    return ()=>clearInterval(t);
  },[imgs.length]);

  return (
    <div className="container">
      <div style={{marginTop:20, marginBottom:24}}>
        <img src={imgs[i]} alt="" style={{width:"100%",maxHeight:420,objectFit:"cover",borderRadius:16}}/>
      </div>
      <h1>Turn your Images into Income</h1>
      <p>
        Upload your Photos, designs, or creative content and start selling to designers, architects and creators today.
        <b> | Secure Payments | Verified Sellers | Instant Downloads |</b>
      </p>
      <div className="row">
        <Link className="pill blue" to="/seller">Seller Login</Link>
        <Link className="pill" to="/buyer">Buyer Login</Link>
        <Link className="pill" to="/explore">Explore Photos</Link>
      </div>
    </div>
  );
}
