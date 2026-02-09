<section>
    <h2>Se connecter</h2>
    <form onsubmit={handleLogin}>
        <label for="email">
            Email :
            <input type="email" placeholder="alice@oclock.io" name="email">
        </label>
        <label for="password">
            Mot de passe :
            <input type="password" placeholder="*****" name="password">
        </label>

        <button>Se connecter</button>
    </form>
</section>

<script lang="ts">
    async function handleLogin(event: SubmitEvent) {
        event.preventDefault();

        const userRegistrationData = Object.fromEntries(new FormData(event.target as HTMLFormElement));

        const url = `${ import.meta.env.VITE_API_BASE_URL }/auth/login`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userRegistrationData)
        });

        if (response.ok) {
            const data = await response.json();

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            alert("Utilisateur connecté avec succès");
        } else {
            alert("Une erreur s'est produite")
        }
    }
</script>