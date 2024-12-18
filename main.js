// ----------- Handling CSV Upload and Email Validation -----------
const upload = document.getElementById('upload');

upload.addEventListener('change', () => {
  if (!upload.files[0] || upload.files[0].type !== 'text/csv') {
    alert('Please upload a valid CSV file.');
    return;
  }

  const fr = new FileReader();
  fr.readAsText(upload.files[0]);

  fr.onload = function () {
    const rows = fr.result.split(/\r?\n|\n/).map(row => row.split(','));

    let validCount = 0;
    let invalidCount = 0;
    const validEmails = [];

    const validTable = document.querySelector('table#val tbody') || document.createElement('tbody');
    const invalidTable = document.querySelector('table#Inval tbody') || document.createElement('tbody');
    validTable.innerHTML = ''; // Clear previous rows
    invalidTable.innerHTML = ''; // Clear previous rows

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    rows.forEach(row => {
      const email = String(row[0]).trim(); // Assuming email is in the first column
      const tableRow = document.createElement('tr');

      // Create table cells for the row
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tableRow.appendChild(td);
      });

      if (email && emailRegex.test(email)) {
        // Valid email
        validEmails.push(email);
        tableRow.style.backgroundColor = '#d4edda'; // Light green for valid rows
        validTable.appendChild(tableRow);
        validCount++;
      } else if (email !== '') {
        // Invalid email
        tableRow.style.backgroundColor = '#f8d7da'; // Light red for invalid rows
        invalidTable.appendChild(tableRow);
        invalidCount++;
      }
    });

    // Update counts
    document.querySelector('#valCount').textContent = validCount;
    document.querySelector('#InvalCount').textContent = invalidCount;

    // Attach updated tables if they don't exist
    if (!document.querySelector('table#val tbody')) {
      document.querySelector('table#val').appendChild(validTable);
    }
    if (!document.querySelector('table#Inval tbody')) {
      document.querySelector('table#Inval').appendChild(invalidTable);
    }

    // Store valid emails locally
    upload.validEmails = validEmails;
  };

  fr.onerror = function () {
    alert('Failed to read file. Please try again.');
  };
});

// ----------- Sending Emails Using SMTP.js -----------
async function sendEmail() {
  const fromEmail = document.querySelector('#from').value.trim(); // Get "From Email"
  const subject = document.querySelector('#subject').value.trim();
  const body = document.getElementById('msg').value.trim();

  // Ensure the "From Email" is valid and not empty
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(fromEmail)) {
    alert('Please enter a valid "From Email".');
    return;
  }

  if (!subject || !body) {
    alert('Please provide both a subject and a message body.');
    return;
  }

  try {
    // SMTP.js email sending logic
    await Email.send({
      SecureToken: "", // Replace with your SMTP.js API key
      To: fromEmail, // Sending email to the entered "From Email"
      From: fromEmail, // Sender's email address
      Subject: subject,
      Body: body,
    });

    alert(`Email successfully sent to: ${fromEmail}`);

  } catch (error) {
    alert('Error sending email: ' + error.message);
  }
}