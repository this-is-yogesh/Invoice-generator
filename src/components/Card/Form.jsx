import React, { useState } from "react";
import "./InvoiceForm.css";
import html2pdf from 'html2pdf.js';
import moment from "moment"

const Form = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    terms: "",
    dueDate: "",
    orderNumber: "",
    orderDate: "",
    poReference: "",
    poDate: "",
    placeOfSupply: "",
    billTo: {
      companyName: "",
      address: "",
      gstin: "",
    },
    deliverTo: {
      companyName: "",
      address: "",
      gstin: "",
    },
    orderItems: [
      { itemName: "", hsn: "", qty: "", rate: "", amount: "" },
    ],
    remarksItems: { description: ""},
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleAddressChange = (e,field, type) => {
    console.log(field,type,'type**')
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [field]: e.target.value,
      },
    });

    console.log(formData.billTo.address,'address**')
  };

  const handleOrderChange = (e, index, field) => {
    const updatedItems = formData.orderItems.map((item, i) =>
      i === index ? { ...item, [field]: e.target.value } : item
    );


    const quantity = updatedItems[index].qty || 0;
    const rate = updatedItems[index].rate || 0;
    updatedItems[index].amount = quantity * rate;

    setFormData({
      ...formData,
      orderItems: updatedItems,
    });
  };

  const handleRemarksChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        ["description"]: e.target.value,
      },
    });

    console.log(formData[field],'formData[field]')
  };

  const addItem = () => {
    setFormData({
      ...formData,
      orderItems: [
        ...formData.orderItems,
        { itemName: "", hsn: "", qty: "", rate: "", amount: "" },
      ],
    });
  };

  const removeItem = index => {
    const updatedItems = formData.orderItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      orderItems: updatedItems,
    });
  };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   const newWindow = window.open();
  //   newWindow.document.write(generateInvoiceHtml(formData));
  //   newWindow.document.close();
  //   newWindow.focus();  
  //   newWindow.print();  
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const invoiceHtml = generateInvoiceHtml(formData);
  //   const tempContainer = document.createElement("div");
  //   tempContainer.innerHTML = invoiceHtml;

  //   html2pdf()
  //     .from(tempContainer)
  //     .set({
  //       margin: 1,
  //       filename: 'invoice.pdf',
  //       image: { type: 'jpeg', quality: 0.98 },
  //       html2canvas: { scale: 1.5 },
  //       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  //     })
  //     .save();
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    const invoiceHtml = generateInvoiceHtml(formData);
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = invoiceHtml;
    html2pdf()
      .from(tempContainer)
      .set({
        margin: [0, 0, 0, 0],
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 3,
          width: 210 * 5.5,
          height: 297 * 3.5,
          useCORS: true,
          scrollY: 0
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['css', 'avoid-all'] }
      })
      .save();
    const newWindow = window.open();
    newWindow.document.write(generateInvoiceHtml(formData));
    newWindow.document.close();

  }

  function generateInvoiceHtml(data) {
    return `
  <div class='container'>
    <div class='row'>
      <div class='col-xs-12'>
        <div class='grid invoice'>
          <div class='grid-body'>
            <div class='invoice-title'>
              <div class='row'>
                <div class='col-xs-3' style="height: 100px; margin-top: 20px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="125" height="27" color1="white" color2="white">
                    <g fill="none" fill-rule="nonzero">
                      <g fill="black">
                        <path
                          d="m54.928.173-1.241 7.7h2.988l-.708 4.057h-2.988l-1.45 8.618c-.081.59-.044 1.034.111 1.335.04.075-.044.026.16.2.204.173.54.268 1.006.286.254.011.501.005.743-.018l.742-.07-.684 4.25c-.495.161-.729.26-1.241.329a9.864 9.864 0 0 1-1.546.086c-.886-.011-1.66-.15-2.323-.416-.662-.266-1.206-.644-1.632-1.136-.426-.49-.73-1.086-.915-1.786-.184-.699-.236-1.488-.156-2.367l1.52-9.311H45l.69-4.058h2.315l.812-4.664L54.928.173ZM69.282 13.161a14.365 14.365 0 0 0-1.762-.173c-.805-.023-1.536.1-2.193.372-.656.272-1.226.737-1.71 1.396l-2.106 11.878h-5.682l3.246-18.762 5.302-.017-.431 2.462c.253-.393.526-.763.82-1.11.294-.346.619-.65.976-.91s.742-.462 1.157-.607a4.12 4.12 0 0 1 1.364-.216c.3 0 .593.023.881.069.288.046.581.104.88.173l-.742 5.445ZM79.454 26.634a3.625 3.625 0 0 1-.198-.84 8.153 8.153 0 0 1-.043-.86c-.622.683-1.307 1.2-2.055 1.553-.749.352-1.59.517-2.522.494a6.125 6.125 0 0 1-2.185-.425 5.464 5.464 0 0 1-1.787-1.136 5.23 5.23 0 0 1-1.192-1.734c-.288-.67-.414-1.404-.38-2.202.023-.832.173-1.566.45-2.202a5.58 5.58 0 0 1 1.087-1.656 6.165 6.165 0 0 1 1.572-1.18 9.68 9.68 0 0 1 1.908-.762 12.98 12.98 0 0 1 2.09-.408c.72-.08 1.43-.12 2.133-.12l1.9.034.207-1.058a5.56 5.56 0 0 0 .06-.919c-.005-.3-.063-.57-.172-.806a1.411 1.411 0 0 0-.493-.581c-.218-.15-.518-.231-.898-.243-.679-.011-1.2.176-1.563.564-.362.387-.607.887-.734 1.5l-5.699.017c.046-1.087.337-2.023.872-2.81a6.567 6.567 0 0 1 2.021-1.924 9.107 9.107 0 0 1 2.694-1.092 11.475 11.475 0 0 1 2.91-.312 9.016 9.016 0 0 1 2.79.485c.857.3 1.594.734 2.21 1.3a5.441 5.441 0 0 1 1.399 2.081c.317.821.423 1.763.32 2.827l-1.227 7.699c-.057.347-.112.708-.164 1.083-.052.376-.086.752-.104 1.128-.017.375-.002.748.044 1.118.046.37.144.722.293 1.058l-.017.33h-5.527Zm-3.246-3.78a3.152 3.152 0 0 0 1.71-.407 4.805 4.805 0 0 0 1.346-1.136l.57-3.017-1.468-.018a4.279 4.279 0 0 0-1.252.217c-.397.133-.754.32-1.07.564a3.04 3.04 0 0 0-.786.901c-.207.359-.34.769-.397 1.231-.058.474.031.865.267 1.17.236.307.596.472 1.08.495ZM88.28 17.219a18.94 18.94 0 0 1 .431-2.341c.196-.786.452-1.54.769-2.263.317-.723.697-1.402 1.14-2.038a7.574 7.574 0 0 1 1.537-1.638 6.727 6.727 0 0 1 1.977-1.067c.737-.254 1.56-.37 2.47-.346.806.023 1.54.208 2.202.554a5.593 5.593 0 0 1 1.753 1.457l1.106-6.357L108.072 0l-4.594 26.634h-5.06l.241-2.029a8.17 8.17 0 0 1-2.055 1.752c-.76.45-1.623.664-2.59.641-.841-.011-1.578-.156-2.211-.433a5 5 0 0 1-1.624-1.119 5.977 5.977 0 0 1-1.105-1.63 9.294 9.294 0 0 1-.656-1.968 11.868 11.868 0 0 1-.26-2.132c-.022-.729 0-1.44.07-2.133l.052-.364Zm5.664.381c-.034.266-.066.57-.095.91-.028.341-.04.688-.034 1.04.006.353.037.703.095 1.05.057.347.158.656.302.928.144.271.34.494.587.667.248.174.567.266.959.278.645.023 1.209-.119 1.692-.425a5.13 5.13 0 0 0 1.296-1.188l1.278-7.196c-.38-1.064-1.14-1.613-2.28-1.647-.68-.012-1.247.15-1.701.485a3.847 3.847 0 0 0-1.106 1.283 7.038 7.038 0 0 0-.647 1.708c-.15.619-.254 1.194-.311 1.726l-.035.381ZM115.912 26.981c-1.3-.023-2.475-.266-3.523-.728-1.048-.463-1.928-1.096-2.642-1.899-.714-.803-1.244-1.754-1.59-2.852-.345-1.099-.46-2.29-.345-3.572l.07-.677a13.07 13.07 0 0 1 1.01-3.84 10.461 10.461 0 0 1 2.072-3.122 9.227 9.227 0 0 1 3.031-2.072c1.163-.497 2.464-.728 3.903-.693 1.301.023 2.427.286 3.377.789a6.446 6.446 0 0 1 2.305 2.01c.588.839.993 1.81 1.218 2.914a10.75 10.75 0 0 1 .112 3.477l-.345 2.375-11.122-.017c-.012.983.241 1.783.76 2.402.518.618 1.283.945 2.297.98a5.332 5.332 0 0 0 2.417-.486 7.455 7.455 0 0 0 2.056-1.422l2.348 3.173a6.002 6.002 0 0 1-1.442 1.491 8.479 8.479 0 0 1-1.848 1.023c-.662.266-1.347.46-2.055.581a11.07 11.07 0 0 1-2.064.165Zm1.606-14.982c-.53-.011-.99.081-1.381.278a3.489 3.489 0 0 0-1.028.78 5.021 5.021 0 0 0-.76 1.118c-.213.422-.4.847-.561 1.275h5.682l.12-.52c.07-.393.082-.766.035-1.119a2.276 2.276 0 0 0-.32-.927 1.788 1.788 0 0 0-.69-.633c-.293-.156-.659-.24-1.097-.252Z">
                        </path>
                      </g>
                      <g fill="black">
                        <path
                          d="M10.29.174 8.843 7.887h3.042l-.721 4.066H8.122l-1.477 8.634c-.082.59-.043 1.036.115 1.338.158.3.554.463 1.186.486.258.012.51.006.756-.017l.756-.07-.705 4.257c-.504.162-.733.26-1.255.33a10.2 10.2 0 0 1-1.573.087c-.903-.012-1.691-.151-2.365-.417-.674-.267-1.228-.646-1.661-1.138-.434-.493-.745-1.09-.932-1.79-.188-.7-.24-1.49-.158-2.371l1.547-9.33H0l.703-4.065H3.06l.826-4.673L10.29.174ZM17.215 26.685h-5.928l3.305-18.798h5.802l-3.18 18.798Zm-2.113-23.54a2.644 2.644 0 0 1 .237-1.217c.17-.359.402-.668.695-.93.293-.26.632-.462 1.02-.607a3.482 3.482 0 0 1 1.23-.217c.422 0 .823.06 1.204.182s.718.301 1.011.539a2.66 2.66 0 0 1 .985 2.041 2.72 2.72 0 0 1-.229 1.216 2.772 2.772 0 0 1-.686.93c-.293.26-.635.463-1.028.608a3.554 3.554 0 0 1-1.24.217c-.41 0-.805-.061-1.186-.183a3.176 3.176 0 0 1-1.02-.538 2.638 2.638 0 0 1-.712-.869 2.687 2.687 0 0 1-.281-1.173ZM26.263 26.685H20.61l4.028-23.397L30.94 0zM41.265.174l-1.306 7.713H43l-.72 4.066h-3.042l-1.477 8.634c-.082.59-.044 1.036.114 1.338.158.3.554.463 1.187.486.258.012.51.006.756-.017l.756-.07-.705 4.257c-.504.162-.734.26-1.255.33a10.2 10.2 0 0 1-1.574.087c-.902-.012-1.69-.151-2.364-.417-.674-.267-1.228-.646-1.662-1.138-.433-.493-.744-1.09-.932-1.79-.187-.7-.24-1.49-.158-2.371l1.547-9.33h-2.356l.704-4.065h2.355l.827-4.673 6.264-3.04Z">
                        </path>
                      </g>
                    </g>
                  </svg>

                </div>
                <div class='col-xs-6 text-left' style="color:black; font-weight:900">
                  <div style="font-size: 20px; font-weight:900; color:black; font-weight:900">SNSG TRADING PRIVATE LIMITED</div>
                  D. No. 8-2-579/A/12, Road No 8,<br />Banjara Hills, Khairatabad,<br />Hyderabad-500034,<br />Telangana
                  <br />
                  GSTIN 36ABLCS7498B1ZU
                </div>

              </div>
              <div class='row'>
                <div class='col-xs-12 text-right' style="margin-top: -40px;">
                  <h2 class='invoice-name'> INVOICE </h2>
                </div>
              </div>
              <hr style='margin: 5px;'>
              <div class='row'>
                <div class="col-xs-6">
                  <div class='row'>
                    <div class='col-xs-12 text-left'>
                      <address class='address-tag'>
                        Invoice Number: <strong>${data?.invoiceNumber}</strong><br>
                      </address>
                    </div>
                    <div class='col-xs-12 text-left'>
                      <address class='address-tag'>
                        Invoice Date: <strong>${data?.invoiceDate&& moment(new Date(data?.invoiceDate)).format("DD MMM, YYYY")}</strong>
                      </address>
                    </div>
                    <div class='col-xs-12 text-left'>
                      <address class='address-tag'>
                        Terms: <strong>${data?.terms}</strong>
                      </address>
                    </div>
                    <div class='col-xs-12 text-left'>
                      <address class='address-tag'>
                        Due Date: <strong>${data?.dueDate&& moment(new Date(data?.dueDate)).format("DD MMM, YYYY")}</strong>
                      </address>
                    </div>
                    <div class='col-xs-12 text-left'>
                      <address class='address-tag'>
                        Order Number: <strong>${data?.orderNumber}</strong><br>
                      </address>
                    </div>
                    <div class='col-xs-12 text-left'>
                      <address class='address-tag'>
                        Order Date: <strong>${data?.orderDate && moment(new Date(data?.orderDate)).format("DD MMM, YYYY")}</strong>
                      </address>
                    </div>
                    <div class='col-xs-12 text-left'>
                      <address class='address-tag'>
                        PO Reference: <strong> ${data?.poReference}</strong><br>
                      </address>
                    </div>
                    <div class='col-xs-12 text-left'>
                      <address class='address-tag'>
                        PO Date: <strong>${data?.poDate&& moment(new Date(data?.poDate)).format("DD MMM, YYYY")}</strong>
                      </address>
                    </div>
                  </div>
                </div>
                <div class='col-xs-6 text-left'>
                  <address class='address-tag'>
                    Place of supply: <strong>${data?.placeOfSupply}</strong>
                  </address>
                </div>

              </div>
            </div>
            <hr style='margin: 5px;'>
            <div class='row'>
              <div class='col-xs-6'>
                <address class='address-tag'>
                  <strong>Bill To:</strong><br />
                  <div style="font-size: 16px; font-weight: bold;">${data?.billTo?.companyName}
                  </div>
                     ${data?.billTo?.address}<br />
                  GSTIN ${data?.billTo?.gstin}<br />
                </address>
              </div>
              <div class='col-xs-6 text-left'>
                <address class='address-tag'>
                  <strong>Deliver To:</strong><br />
                  <div style="font-size: 16px; font-weight: bold;">${data?.deliverTo?.companyName}
                  </div>
                  ${data?.deliverTo?.address}<br />
                  GSTIN ${data?.deliverTo?.gstin}<br />
                </address>
              </div>

            </div>
            <div class='row'>
              <div class='col-xs-12'>
                <table cellpadding='4' cellspacing='0' class='checkouttable' style='background-color: #ffffff; font-family: sans-serif; font-size: 14px; width: 100%; color: #666;
              border: 1px solid #fff; border-collapse: collapse;color:black; font-weight:900'>
                  <h3 class='order-summary' style="color:black; font-weight:900">ORDER SUMMARY</h3>
                  <thead>
                    <tr>
                      <th style='border: 1px solid #e3e3e3; border-collapse: collapse;text-align: left; padding: 5px'
                        colspan='2'>Item</th>
                      <th style='border: 1px solid #e3e3e3; border-collapse: collapse;text-align: left; padding: 5px'
                        colspan='2'>HSN/SAC</th>
                      <th style='border: 1px solid #e3e3e3; border-collapse: collapse;text-align: right;; padding: 5px'
                        colspan='2'>Qty</th>
                      <th style='border: 1px solid #e3e3e3; border-collapse: collapse;text-align: right; padding: 5px'
                        colspan='2'>Rate</th>
                      <th style='border: 1px solid #e3e3e3; border-collapse: collapse;text-align: right; padding: 5px'
                        colspan='2'>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style='text-align: center; border: 1px solid #e3e3e3; border-collapse: collapse; height: 32px;text-align: left; padding: 5px'
                        colspan='2'>
                        ${data?.orderItems?.[0]?.itemName}<br />
                      </td>
                      <td
                        style='text-align: center; border: 1px solid #e3e3e3; border-collapse: collapse; height: 32px;text-align: left; padding: 5px'
                        colspan='2'>
                        ${data?.orderItems?.[0]?.hsn}
                      </td>

                      <td
                        style='text-align: center; border: 1px solid #e3e3e3; border-collapse: collapse; height: 32px;text-align: right; padding: 5px;color:black; font-weight:900'
                        colspan='2'>
                        ${data?.orderItems?.[0]?.qty} <br />
                        Kg
                      </td>
                      <td style='text-align: center; border: 1px solid #e3e3e3; border-collapse:
                      collapse; height: 32px; text-align: right;; padding: 5px' colspan='2'>
                        ${data?.orderItems?.[0]?.rate}
                      </td>
                      <td
                        style='text-align: center; border: 1px solid #e3e3e3; border-collapse: collapse; height: 32px; text-align: right; padding: 5px'
                        colspan='2'>
                     ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data?.orderItems?.[0]?.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class='row'>
              <div class='col-xs-8 text-left' style="font-size: 11px;color:black; font-weight:900">
                     <div>
                  <br/><br/>
                  Remarks: <br/>${data?.remarksItems?.description.split('\n').join("<br/>")}<br/>
                </div>
              </div>

              <div class='col-xs-4 text-left'>
                <table cellpadding='10' cellspacing='5' class='tablenb' style='border: 1px solid #666666 !important; border-top: 0px !important; margin-left: 2px; background-color: #ffffff; font-family: sans-serif; font-size: 14px; width: 100%; color: #666;
                border: none;'>
                  <tbody>

                    <tr>
                      <td style='text-align: center;height: 32px; color:black; font-weight:900'>
                        Sub Total
                      </td>
                      <td style='text-align: right;height: 32px; padding-right: 10px;color:black; font-weight:900'>
                      ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data?.orderItems?.[0]?.amount)}
                      </td>
                    </tr>
                    <tr>
                      <td style='text-align: center;height: 32px;color:black; font-weight:900'>
                        SGST (9%)
                      </td>
                      <td style='text-align: right;height: 32px;  padding-right: 10px;'>
                        
                      </td>
                    </tr>
                    <tr>
                      <td style='text-align: center;height: 32px;color:black; font-weight:900'>
                        CGST (9%)
                      </td>
                      <td style='text-align: right;height: 32px; padding-right: 10px;'>
                        
                      </td>
                    </tr>
                    <tr>
                      <td style='text-align: center;height: 32px;color:black; font-weight:900'>
                        IGST (18%)
                      </td>
                      <td style='text-align: right;height: 32px; padding-right: 10px;color:black; font-weight:900'>
                      ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((data?.orderItems[0]?.amount * 18) / 100)}
                      </td>
                    </tr>
                    <tr>
                      <td style='text-align: center;height: 32px;color:black; font-weight:900'>
                        Total
                      </td>
                      <td style='text-align: right;height: 32px; padding-right: 10px;color:black; font-weight:900'>
                         ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((data?.orderItems[0]?.amount * 18 / 100) + data?.orderItems[0]?.amount)}
                      </td>
                    </tr>
                    <tr>
                      <td style='text-align: center;height: 80px; border-top: 1px solid #666666 !important;color:black; font-weight:900'
                        colspan='2'>
                        <br /><br /><br />
                        Authorized signature
                      </td>
                    </tr>
                  </tbody>
                </table>
  <div class='text-center'>
    Powered by Presto
  </div>
              </div>
            </div>

            <br><br>
            <div class='row'>
              <div class='col-xs-12 text-right'>
                Merchant copy
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END INVOICE -->
    </div>
  </div>

  <style type='text/css'>
    body {
      margin-top: 20px;
      background: #eee;
    
    }

    .invoice {
      padding: 30px;
    }

    .invoice-name {
      margin: 0px auto 5px auto;
    }

    .order-summary-form {
      margin: 0px auto 5px auto;
      color:black;
      font-weight:900;
    }

    .address-tag {
      margin-bottom: 10px;
      color:black;
      font-weight:900 !important;
    }

    .invoice h2 {
      margin-top: 0px;
      line-height: 0.8em;
    }

    .invoice .small {
      font-weight: 300;
    }

    .invoice hr {
      margin-top: 10px;
      border-color: #ddd;
    }

    .invoice .table tr.line {
      border-bottom: 1px solid #ccc;
    }

    .invoice .table td {
      border: none;
    }

    .invoice .identity {
      margin-top: 10px;
      font-size: 1.1em;
      font-weight: 300;
    }

    .invoice .identity strong {
      font-weight: 600;
    }

    .grid {
      position: relative;
      width: 100%;
      background: #fff;
      color: #666666;
      border-radius: 2px;
      margin-bottom: 25px;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    }

    table,
    th {
      color:black;
      font-weight:900;
       border: 1px solid #000000 !important;
      border-collapse: collapse;
    },
    td {
      border: 2px solid #000000 !important;
      border-collapse: collapse;

    }


    table.tablenb,
    table.tablenb>th,
    table.tablenb>td {
      border: 0px solid #666666 !important;
      border-collapse: collapse;
    }

    abbr[title] {
      border-bottom: 1px dotted;
    }

    strong {
      font-weight: 700;
    }

    img {
      border: 0;
    }

    hr {
      height: 0;
      -webkit-box-sizing: content-box;
      -moz-box-sizing: content-box;
      box-sizing: content-box;
    }

    table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    td {
      padding: 0;
    }

    * {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    :after,
    :before {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    html {
      font-size: 10px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.42857143;
      color: #333;
      background-color: #fff;
    }

    img {
      vertical-align: middle;
    }

    hr {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid #eee;
    }

    h2,
    h3 {
      font-family: inherit;
      font-weight: 500;
      line-height: 1.1;
      color: inherit;
    }

    h2 .small {
      font-weight: 400;
      line-height: 1;
      color: #777;
    }

    h2,
    h3 {
      margin-top: 20px;
      margin-bottom: 10px;
    }

    h2 .small {
      font-size: 65%;
    }

    h2 {
      font-size: 30px;
    }

    h3 {
      font-size: 24px;
    }

    .small {
      font-size: 85%;
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    abbr[title] {
      cursor: help;
      border-bottom: 1px dotted #777;
    }

    address {
      margin-bottom: 20px;
      font-style: normal;
      line-height: 1.42857143;
    }

    .container {
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }

    @media (min-width:768px) {
      .container {
        width: 100%;
      }
    }

    @media (min-width:992px) {
      .container {
        width: 970px;
      }
    }

    @media (min-width:1200px) {
      .container {
        width: 1170px;
      }
    }

    .row {
      margin-right: -15px;
      margin-left: -15px;
    }

    .col-md-12,
    .col-xs-12,
    .col-xs-6,
    .col-xs-3,
    .col-xs-4,
    .col-xs-9,
    .col-xs-8 {
      position: relative;
      min-height: 1px;
      padding-right: 15px;
      padding-left: 15px;
    }

    .col-xs-12,
    .col-xs-6,
    .col-xs-3,
    .col-xs-4,
    .col-xs-9,
    .col-xs-8 {
      float: left;
    }

    .col-xs-12 {
      width: 100%;
    }

    .col-xs-6 {
      width: 50%;
    }

    .col-xs-4 {
      width: 33%;
    }

    .col-xs-3 {
      width: 25%;
    }

    .col-xs-8 {
      width: 66.66%;
    }

    @media (min-width:992px) {
      .col-md-12 {
        float: left;
      }

      .col-md-12 {
        width: 100%;
      }
    }

    table {
      background-color: transparent;
    }

    .table {
      width: 100%;
      max-width: 100%;
      margin-bottom: 20px;
    }

    .table>tbody>tr>td,
    .table>thead>tr>td {
      padding: 8px;
      line-height: 1.42857143;
      vertical-align: top;
      border-top: 1px solid #ddd;
    }


    .tablenb>tbody>tr>td,
    .tablenb>thead>tr>td {
      padding: 8px;
      line-height: 1.42857143;
      vertical-align: top;
      border-top: 0px solid #ddd !important;
      border: 0px solid #ddd !important;
    }

    .table>thead:first-child>tr:first-child>td {
      border-top: 0;
    }

    .table-striped>tbody>tr:nth-of-type(odd) {
      background-color: #f9f9f9;
    }

    .container:after,
    .container:before,
    .row:after,
    .row:before {
      display: table;
      content: ' ';
    }

    .container:after,
    .row:after {
      clear: both;
    }

    /*! CSS Used from: Embedded */
    body {
      margin-top: 20px;
      background: #eee;
    }

    .invoice {
      padding: 30px;
    }

    .invoice h2 {
      margin-top: 0px;
      line-height: 0.8em;
    }

    .invoice .small {
      font-weight: 300;
    }

    .invoice hr {
      margin-top: 10px;
      border-color: #ddd;
    }

    .invoice .table tr.line {
      border-bottom: 1px solid #ccc;
    }

    .invoice .table td {
      border: none;
    }

    .grid {
      position: relative;
      width: 100%;
      background: #fff;
      color: #666666;
      border-radius: 2px;
      margin-bottom: 25px;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    }

    table,
    td {
      border: 1px solid #666666 !important;
      border-collapse: collapse;
    }

    body {
      margin: 0px !important;
    }

    .container {}
  </style>
    `
  }




  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1 style={{ padding: "5px", textAlign: "left", textDecoration: "underline", height: "80px", textAlign: "center" }}>Invoice Generator</h1>
      <div className="row">
        <div className="col-xs-6">
          <label>Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
          />
        </div>
        <div className="col-xs-6">
          <label>Invoice Date</label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-xs-6">
          <label>Terms</label>
          <input
            type="text"
            name="terms"
            value={formData.terms}
            onChange={handleChange}
          />
        </div>
        <div className="col-xs-6">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-xs-6">
          <label>Order Number</label>
          <input
            type="text"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
          />
        </div>

        <div className="col-xs-6">
          <label>Order Date</label>
          <input
            type="date"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-xs-6">
          <label>PO Reference</label>
          <input
            type="text"
            name="poReference"
            value={formData.poReference}
            onChange={handleChange}
          />
        </div>
        <div className="col-xs-6">
          <label>PO Date</label>
          <input
            type="date"
            name="poDate"
            value={formData.poDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-xs-6">
          <label>Place of Supply</label>
          <input
            type="text"
            name="placeOfSupply"
            value={formData.placeOfSupply}
            onChange={handleChange}
          />
        </div>

      </div>

      <hr />
      <div className="row">
        <div className="col-xs-6">
          <h3>Bill To</h3>
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.billTo.companyName}
            onChange={e => handleAddressChange(e, "companyName", "billTo")}
          />
          <label>Address</label>
          <textarea
            name="address"
            value={formData.billTo.address}
            onChange={e => handleAddressChange(e,"address", "billTo")}
          />
          <label>GSTIN</label>
          <input
            type="text"
            name="gstin"
            value={formData.billTo.gstin}
            onChange={e => handleAddressChange(e, "gstin","billTo")}
          />
        </div>
        <div className="col-xs-6">
          <h3>Deliver To</h3>
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.deliverTo.companyName}
            onChange={e => handleAddressChange(e, "companyName","deliverTo")}
          />
          <label>Address</label>
          <textarea
            type="text"
            name="address"
            value={formData.deliverTo.address}
            onChange={e => handleAddressChange(e, "address","deliverTo")}
          />
          <label>GSTIN</label>
          <input
            type="text"
            name="gstin"
            value={formData.deliverTo.gstin}
            onChange={e => handleAddressChange(e, "gstin","deliverTo")}
          />
        </div>
      </div>
      <hr />
        <div className="col-xs-12">
        <h3  style={{textAlign:"left"}}>Remarks</h3>
        <label>Description:</label>
        <textarea
          type="text"
          className="remarks"
          name="description"
          value={formData.remarksItems.description}
          onChange={(e) => handleRemarksChange(e, "remarksItems")}
        />
        </div>
      <hr />

      <h3 className="order-summary">ORDER SUMMARY</h3>
      <div className="row ">
 
        <div className="col-xs-12 form-col">

          <table className="checkouttable-form">
            <thead>
              <tr>

                <th>Item</th>
                <th>HSN/SAC</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.orderItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="itemName"
                      value={item.itemName}
                      onChange={(e) => handleOrderChange(e, index, "itemName")}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="hsn"
                      value={item.hsn}
                      onChange={(e) => handleOrderChange(e, index, "hsn")}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="qty"
                      value={item.qty}
                      onChange={(e) => handleOrderChange(e, index, "qty")}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="rate"
                      value={item.rate}
                      onChange={(e) => handleOrderChange(e, index, "rate")}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="amount"
                      value={item.amount}
                      readOnly
                    />
                  </td>
                  <td>
                    <button type="button" style={{ backgroundColor: "red", fontWeight: 400, color: "white", marginLeft: "5px" }} onClick={() => removeItem(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" style={{ backgroundColor: "green", fontWeight: 400, color: "white" }} onClick={addItem}>
            Add Item
          </button>
        </div>
      </div>
      <div className="button-wrapper">
        <button type="submit" className="submit-btn">
          Generate Invoice
        </button>
      </div>
    </form>
  );
};

export default Form;
