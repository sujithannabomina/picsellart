import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase";

const db = getFirestore(initializeApp(firebaseConfig));

export default function SellerLogin(){
  const { user, role, loginAs } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      if (!user || role !== "seller") {
        await loginAs("seller");
      }
      // check plan
      const ref = doc(db, "plans", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists() || snap.data().status !== "active") {
        nav("/seller/subscribe", { replace: true });
      } else {
        nav("/seller/dashboard", { replace: true });
      }
    })();
  }, [user, role, loginAs, nav]);

  return <div className="container"><p>Signing you in…</p></div>;
}
