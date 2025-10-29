import React from "react";

export default function Refunds() {
  return (
    <div className="container">
      <h1>Refunds & Cancellations</h1>
      <p style={{color:"#475569"}}>
        Because digital files are delivered instantly, completed purchases are
        generally <b>non-refundable</b>. If you experience a payment error, receive
        the wrong file, or the file is corrupt/unusable, contact us within
        <b> 48 hours</b> via the Contact page. We’ll review the order and provide a
        replacement or refund when appropriate.
      </p>

      <h3 style={{marginTop:20}}>When refunds may apply</h3>
      <ul style={{lineHeight:1.8, color:"#334155"}}>
        <li>Duplicate charges or accidental double purchase</li>
        <li>Corrupted file and seller can’t provide a working replacement</li>
        <li>Incorrect file delivered (different from the listing)</li>
      </ul>

      <h3 style={{marginTop:20}}>When refunds don’t apply</h3>
      <ul style={{lineHeight:1.8, color:"#334155"}}>
        <li>Change of mind after download</li>
        <li>Misuse of the file or violation of license terms</li>
        <li>Requests made well after the purchase date</li>
      </ul>

      <p style={{marginTop:16, color:"#475569"}}>
        Tip: Include your order ID and the image name in your message for the
        fastest resolution.
      </p>
    </div>
  );
}
