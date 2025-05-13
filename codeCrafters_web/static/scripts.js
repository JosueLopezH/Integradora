document.addEventListener("DOMContentLoaded", function () {
  
  
  const form = document.getElementById("loginForm"); // Usamos el id correcto 'loginForm'
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("HOLAA")
    try {
      console.log("entraste");
      const response = await fetch("/crud/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        messageDiv.textContent =
          errorData.message || "Inicio de sesión fallido.";
        return;
      }

      const data = await response.json();
      if (data.success) {
        window.location.href = data.redirect;
      } else {
        messageDiv.textContent = data.message || "Inicio de sesión fallido.";
      }
    } catch (error) {
      alert("Error durante el inicio de sesión:", error);
      messageDiv.textContent = "Ocurrió un error durante el inicio de sesión.";
    }
  });
  
});


