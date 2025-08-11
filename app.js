async function sendSoap(apiUrl, action, xml) {
  try {
    const res = await fetch(
      `/proxy?url=${encodeURIComponent(apiUrl)}&action=${encodeURIComponent(
        action
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "text/xml" },
        body: xml,
      }
    );
    return await res.text();
  } catch (err) {
    return "Error: " + err.message;
  }
}

function extractSoapValue(xmlString, tagName) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    // Namespace-agnostic selector
    const el =
      xmlDoc.querySelector(tagName) ||
      xmlDoc.querySelector(
        `*:is(${tagName}, ${tagName}Result, *|${tagName}Result)`
      );
    if (el) return el.textContent.trim();
    // Fallback: find any element ending in tagName
    const all = xmlDoc.getElementsByTagNameNS("*", tagName);
    return all.length ? all[0].textContent.trim() : "No value found";
  } catch {
    return "Parse error";
  }
}

// Calculator
async function callCalculator(op) {
  const a = document.getElementById("calcNum1").value;
  const b = document.getElementById("calcNum2").value;

  if (!a || !b) {
    document.getElementById("calcResult").textContent = "Enter both numbers";
    return;
  }

  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <${op} xmlns="http://tempuri.org/">
        <intA>${a}</intA>
        <intB>${b}</intB>
      </${op}>
    </soap:Body>
  </soap:Envelope>`;

  const res = await sendSoap(
    "http://www.dneonline.com/calculator.asmx",
    `http://tempuri.org/${op}`,
    xml
  );
  document.getElementById("calcResult").textContent = extractSoapValue(
    res,
    `${op}Result`
  );
}

// Temperature Conversion
async function callTemp(op) {
  const val = document.getElementById("tempValue").value;

  if (!val) {
    document.getElementById("tempResult").textContent = "Enter a value";
    return;
  }

  const tag = op === "CelsiusToFahrenheit" ? "Celsius" : "Fahrenheit";

  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <${op} xmlns="https://www.w3schools.com/xml/">
        <${tag}>${val}</${tag}>
      </${op}>
    </soap:Body>
  </soap:Envelope>`;

  const res = await sendSoap(
    "https://www.w3schools.com/xml/tempconvert.asmx",
    `https://www.w3schools.com/xml/${op}`,
    xml
  );
  document.getElementById("tempResult").textContent = extractSoapValue(
    res,
    `${op}Result`
  );
}

// Number Conversion
async function callNumber(op) {
  const val = document.getElementById("numValue").value;

  if (!val) {
    document.getElementById("numResult").textContent = "Enter a number";
    return;
  }

  const tag = op === "NumberToWords" ? "ubiNum" : "dNum";

  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <${op} xmlns="http://www.dataaccess.com/webservicesserver/">
        <${tag}>${val}</${tag}>
      </${op}>
    </soap:Body>
  </soap:Envelope>`;

  const res = await sendSoap(
    "https://www.dataaccess.com/webservicesserver/numberconversion.wso",
    `http://www.dataaccess.com/webservicesserver/${op}`,
    xml
  );
  document.getElementById("numResult").textContent = extractSoapValue(
    res,
    `${op}Result`
  );
}

// Country Info
async function callCountry(op) {
  const iso = document.getElementById("countryCode").value;

  if (!iso) {
    document.getElementById("countryResult").textContent =
      "Enter a country code";
    return;
  }

  const ns = "http://www.oorsprong.org/websamples.countryinfo";
  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <${op} xmlns="${ns}">
        <sCountryISOCode>${iso}</sCountryISOCode>
      </${op}>
    </soap:Body>
  </soap:Envelope>`;

  const res = await sendSoap(
    "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso",
    `${ns}/${op}`,
    xml
  );
  document.getElementById("countryResult").textContent = extractSoapValue(
    res,
    `${op}Result`
  );
}

// Attach events
document.getElementById("btnAdd").onclick = () => callCalculator("Add");
document.getElementById("btnSub").onclick = () => callCalculator("Subtract");
document.getElementById("btnMul").onclick = () => callCalculator("Multiply");
document.getElementById("btnDiv").onclick = () => callCalculator("Divide");

document.getElementById("btnCtoF").onclick = () =>
  callTemp("CelsiusToFahrenheit");
document.getElementById("btnFtoC").onclick = () =>
  callTemp("FahrenheitToCelsius");

document.getElementById("btnNumWords").onclick = () =>
  callNumber("NumberToWords");
document.getElementById("btnNumDollars").onclick = () =>
  callNumber("NumberToDollars");

document.getElementById("btnCapital").onclick = () =>
  callCountry("CapitalCity");
document.getElementById("btnFullInfo").onclick = () =>
  callCountry("FullCountryInfo");
