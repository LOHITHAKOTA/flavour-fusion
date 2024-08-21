document.addEventListener("DOMContentLoaded", function() {
    fetch('/user')
        .then(response => response.json())
        .then(data => {
            const logoutLink = document.getElementById('logoutLink');
            const userNameElement = document.getElementById('userName');

            if (data.userName !== 'Guest') {
                userNameElement.textContent = `Welcome ${data.userName}!`;
                logoutLink.style.display = 'block';
            } else {
                logoutLink.style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching user name:', error));
});