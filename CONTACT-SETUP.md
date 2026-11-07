# Contact form

The footer sends visitor messages to geoffreylhk@gmail.com through FormSubmit, without opening an email app. JavaScript submits on the page; the ordinary form action is a fallback if JavaScript is unavailable.

## One-time activation

1. Open the site through VS Code Live Server or the deployed website (not a file:// URL).
2. Send a test message using the contact form.
3. Open the activation email from FormSubmit at geoffreylhk@gmail.com (check spam) and confirm the form.
4. Send another test and verify it arrives, including the sender's reply email.

Until activation, email delivery is not verified. A successful form response means FormSubmit accepted the submission; it does not prove inbox delivery.

No API keys or email passwords belong in this static website. FormSubmit processes the visitor's name, email, and message. The form includes a honeypot; provider spam filtering still applies.

Validation performed locally: JavaScript syntax, accepted provider response, provider rejection, HTTP failure, and network failure. No real message has been sent and activation has not been performed.
