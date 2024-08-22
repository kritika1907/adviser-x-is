import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';

function Payment() {
  const [response, setResponse] = useState(null);

  const auth = getAuth();

  const createOrder = async () => {
    const username = 'rzp_live_fHsSBLQQOxeKlA';
    const password = 'jbycwjZLOrVfRDs77i2kHM6x';
    const credentials = btoa(`${username}:${password}`); // Base64 encode the username and password
    
    let data = null;
    const orderData = {
      amount: 100,
      currency: "INR",
      receipt: "qwsaq1"
    };

    try {
      const res = await fetch('https://adviserxiis-backend.vercel.app/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

       data = await res.json();
      setResponse(data);
      console.log('Order created:', data);
    } catch (error) {
      console.error('Error creating order:', error);
      setResponse(null);
    }


    var options = {
        "key": "rzp_live_fHsSBLQQOxeKlA", // Enter the Key ID generated from the Dashboard
        "amount": orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp", //your business name
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": async function (response){

            const body = { ...response};

          const validateResponse =  await fetch('https://adviserxiis-backend.vercel.app/order/validate',{
               method:"POST",
               body:JSON.stringify(body),
               headers:{
                "Content-Type":"application/json",
               },
            })

            const jsonRes = await validateResponse.json();
            if(validateResponse.status == 200)
                {
                    alert("Payment successfull")
                }
            console.log("Response", jsonRes)

        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": "Gaurav Kumar", //your customer's name
            "email": "gaurav.kumar@example.com", 
            "contact": "9000000000"  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.prventDefault()

    console.log("hiiii")
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={createOrder} className="bg-blue-500 text-white px-3 py-2 rounded">
        Create Order
      </button>
      {response && (
        <div className="mt-4">
          <h3>Order Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Payment;
