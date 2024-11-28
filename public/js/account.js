// Fetch user data and display username
fetch('/api/user')
    .then(response => response.json())
    .then(data => {
        document.getElementById('userName').textContent = data.userName;
    })
    .catch(err => console.error('Error fetching user data:', err));

// Logout function
function logout() {
    fetch('/logout')
        .then(() => {
            window.location.href = '/login';
        })
        .catch(err => console.error('Error logging out:', err));
}

// Handle account editing
const editForm = document.getElementById('editForm');
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newName = document.getElementById('editName').value;
    const newEmail = document.getElementById('editEmail').value;
    const newPassword = document.getElementById('editPassword').value;

    try {
        const response = await fetch('/api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName, email: newEmail, password: newPassword }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Account updated successfully!');
            // Redirect to the homepage
            window.location.href = '/';
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating account:', error);
    }
});

// Handle account deletion
const deleteButton = document.getElementById('deleteAccount');
deleteButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            const response = await fetch('/api/user', { method: 'DELETE' });
            if (response.ok) {
                alert('Account deleted successfully.');
                window.location.href = '/register';
            } else {
                alert('Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    }
});
