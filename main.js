 const form = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const confirmation = document.getElementById('confirmation');
    const studentList = document.getElementById('studentList');
    const downloadBtn = document.getElementById('downloadBtn');
    const enableDownload = document.getElementById('enableDownload');
    const adminCodeInput = document.getElementById('adminCode');
    const adminPanel = document.getElementById('adminPanel');
    const adminUnlock = document.getElementById('adminUnlock');

    const ADMIN_CODE = "code3admin";
    const ADMIN_EMAIL = "kamaraisaacpatrick@gmail.com";

    let students = JSON.parse(localStorage.getItem('students') || '[]');

    function renderList() {
      studentList.innerHTML = '';
      students.forEach(({ name, email, interests }) => {
        const li = document.createElement('li');
        li.textContent = `${name} (${email}) - Interested in: ${interests.join(', ')}`;
        studentList.appendChild(li);
      });
    }

    function saveToLocalStorage() {
      localStorage.setItem('students', JSON.stringify(students));
    }

    function sendEmailNotification(name, email, interests) {
      const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=New%20Student%20Registered&body=Name:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0AInterests:%20${encodeURIComponent(interests.join(', '))}`;
      const tempLink = document.createElement('a');
      tempLink.href = mailtoLink;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const interestNodes = document.querySelectorAll('.interest:checked');
      const interests = Array.from(interestNodes).map(el => el.value);

      if (name && email && interests.length > 0) {
        students.push({ name, email, interests });
        saveToLocalStorage();
        renderList();
        confirmation.classList.remove('hidden');
        nameInput.value = '';
        emailInput.value = '';
        document.querySelectorAll('.interest').forEach(i => i.checked = false);
        sendEmailNotification(name, email, interests);
      } else {
        alert('Please fill out all fields and select at least one interest.');
      }
    });

    enableDownload.addEventListener('click', function() {
      const entered = adminCodeInput.value.trim();
      if (entered === ADMIN_CODE) {
        adminPanel.classList.remove('hidden');
        adminUnlock.classList.add('hidden');
        renderList();
      } else {
        alert('Incorrect admin code.');
      }
    });

    downloadBtn.addEventListener('click', function() {
      if (!students.length) return alert('No students to download');
      let csvContent = 'Name,Email,Interests\n' +
        students.map(s => `${s.name},${s.email},"${s.interests.join('; ')}"`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registered_students.csv';
      a.click();
    });