<section>
  <h2>Créer un compte</h2>
  <form onsubmit={handleSignup}>
    <label for="firstname">
      <span>Prénom :</span>
      <input type="text" placeholder="Alice" autocomplete="given-name" name="firstname">
    </label>

    <label for="lastname">
      <span>Nom :</span>
      <input type="text" placeholder="O'Clock" autocomplete="family-name" name="lastname">
    </label>

    <label for="email">
      <span>Email :</span>
      <input type="email" placeholder="alice@oclock.io" autocomplete="email" name="email">
    </label>

    <label for="password">
      <span>Mot de passe :</span>
      <input type="password" placeholder="*****" autocomplete="new-password" name="password">
    </label>

    <label for="confirm">
      <span>Confirmation :</span>
      <input type="password" placeholder="*****" autocomplete="new-password" name="confirm">
    </label>

    <button>S'inscrire</button>
  </form>
</section>

<section>
  <h2>Se connecter</h2>
  <form onsubmit={handleLogin}>
    <label for="email">
      <span>Email :</span>
      <input type="email" placeholder="alice@oclock.io" autocomplete="email" name="email">
    </label>

    <label for="password">
      <span>Mot de passe :</span>
      <input type="password" placeholder="*****" autocomplete="current-password"name="password">
    </label>

    <button>Se connecter</button>
  </form>
</section>

<script lang="ts">
  async function handleSignup(event: SubmitEvent) {
    event.preventDefault();

    const userRegistrationData = Object.fromEntries(new FormData(event.target as HTMLFormElement));
    const url = `${import.meta.env.VITE_API_BASE_URL}/auth/register`;
    const httpResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userRegistrationData)
    });
    
    if (httpResponse.ok) {
      alert("Utilisateur créé avec succès.");
    } else {
      alert("Une erreur s'est produite.");
    }
  }

    async function handleLogin(event: SubmitEvent) {
    event.preventDefault();

    const userLoginData = Object.fromEntries(new FormData(event.target as HTMLFormElement));
    const url = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
    const httpResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userLoginData),
      credentials: "include"
    });
    
    if (httpResponse.ok) {
      alert("Utilisateur connecté avec succès. Recharger la page.");
    } else {
      alert("Une erreur s'est produite.");
    }
  }
</script>


<style scoped>
  label {
    margin-bottom: 1rem;
    display: block;

    span {
      display: inline-block;
      width: 120px;
    }
  }
</style>
