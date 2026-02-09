<section>
    <h2>Créer un compte</h2>
    <form onsubmit={handleSignup}>
        <label for="firstname">
            Prénom :
            <input type="text" placeholder="Alice" name="firstname">
        </label>

        <label for="lastname">
            Nom :
            <input type="text" placeholder="O'Clock" name="lastname">
        </label>

        <label for="email">
            Email :
            <input type="email" placeholder="alice@oclock.io" name="email">
        </label>

        <label for="password">
            Mot de passe :
            <input type="password" placeholder="******" name="password">
        </label>

        <label for="confirm">
            Confirmation :
            <input type="password" placeholder="******" name="confirm">
        </label>

        <button>S'inscrire</button>
    </form>
</section>

<script lang="ts">
    async function handleSignup(event: SubmitEvent) {
        event.preventDefault();

        const userRegistrationData = Object.fromEntries(new FormData(event.target as HTMLFormElement));

        const url = `${ import.meta.env.VITE_API_BASE_URL }/auth/signup`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userRegistrationData)
        });

        if (response.ok) {
            alert("Utilisateur créé avec succès");
        } else {
            alert("Une erreur s'est produite")
        }
    }
</script>