# Paint Key Exchange — Teacher Resource Pack

**A visual tool for teaching Diffie-Hellman key exchange to T-Level and BTEC Computing students.**

> *"How can two people agree on a secret in public, without ever speaking the secret aloud?"*
>
> That single question is the starting point for every lesson using this app.

---

## Contents

1. [What this app does](#1-what-this-app-does)
2. [Running the app](#2-running-the-app)
3. [Curriculum alignment](#3-curriculum-alignment)
4. [Background: the problem of key exchange](#4-background-the-problem-of-key-exchange)
5. [The paint metaphor explained](#5-the-paint-metaphor-explained)
6. [The real mathematics: Diffie-Hellman step by step](#6-the-real-mathematics-diffie-hellman-step-by-step)
7. [Step-by-step teaching guide](#7-step-by-step-teaching-guide)
8. [Classroom discussion questions](#8-classroom-discussion-questions)
9. [Assessment activities](#9-assessment-activities)
10. [Extension activities](#10-extension-activities)
11. [Common misconceptions to address](#11-common-misconceptions-to-address)
12. [Glossary](#12-glossary)
13. [Further reading and references](#13-further-reading-and-references)
14. [Licence](#14-licence)

---

## 1. What this app does

This single-page web application uses a **paint-mixing metaphor** to make the abstract
Diffie-Hellman (DH) key exchange protocol tangible for students aged 16–19.

The app has two modes:

| Mode | Purpose |
|------|---------|
| **Teaching Mode** | A guided, 7-step walkthrough with an animated SVG paint scene, plain-English descriptions, and a side panel connecting each step to the real cryptographic operation. |
| **Simulation Mode** | An interactive sandbox where students choose their own secret colours for Alice and Bob, watch all intermediate mixtures update in real time, and see Eve's failed attempt to reconstruct the shared secret. |

---

## 2. Running the app

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### First run

```bash
git clone <repo-url>
cd paint-key-exchange
npm install
npm run dev
```

Open `http://localhost:5173` in a browser. The app is **entirely client-side** — there
is no back-end, no network requests after the initial page load, and no data is stored
anywhere. It is safe to run on a school intranet or from a USB stick.

### Production build

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

The `dist/` folder can be hosted on any static file server or school website.

---

## 3. Curriculum alignment

### T-Level Digital — Core Technical Content

| T-Level unit area | Coverage in this resource |
|-------------------|--------------------------|
| **Fundamentals of cyber security** — encryption concepts | DH key exchange, symmetric vs asymmetric concepts |
| **Fundamentals of cyber security** — protocols and standards | TLS/HTTPS connection setup (DH is used in the handshake) |
| **Data and information** — data transmission | Public vs private channel concepts |
| **Digital infrastructure** — networking security | How keys are exchanged before encrypted communication begins |

### BTEC Level 3 National in Computing

| Unit | Coverage |
|------|---------|
| **Unit 5: Security** — encryption techniques | Asymmetric key exchange, public/private keys |
| **Unit 2: Networking** — network security | TLS handshake, HTTPS |

### A-Level Computer Science (OCR/AQA)

The discrete logarithm problem, modular arithmetic, and the DH protocol all appear as
extension material in most A-Level specifications and make excellent enrichment for
students targeting university computing courses.

---

## 4. Background: the problem of key exchange

### Why is this problem hard?

Imagine Alice wants to send Bob a secret message. She encrypts it using a key (think of
a password). For Bob to read it, he needs the same key. But if Alice sends the key to
Bob over the internet, anyone listening can intercept the key and then decrypt every
message they capture.

This is the **key exchange problem**: *how do two people agree on a shared secret when
their only communication channel is public and observable?*

For decades this seemed impossible. Then in 1976, Whitfield Diffie and Martin Hellman
published a paper that solved it — using a mathematical operation that is easy to perform
but (as far as we know) impossible to reverse efficiently.

### Why it matters today

Every time a browser shows the padlock icon and loads a page over HTTPS, a version of
Diffie-Hellman is running in the background. Within milliseconds of connecting to a
website, your browser and the server:

1. Perform a DH key exchange to derive a shared secret.
2. Use that shared secret as the basis for a symmetric encryption key.
3. Encrypt everything you send and receive with that key.

The eavesdropper (Eve) can see every single packet on the wire — but without solving
the Discrete Logarithm Problem, she cannot recover the key.

---

## 5. The paint metaphor explained

Diffie-Hellman works because of a mathematical operation that is *easy in one direction
and hard in the other* — just like mixing paint.

| Paint step | Property |
|-----------|---------|
| Mix yellow + blue | Quick and easy to do |
| Un-mix a green paint back to yellow and blue | Essentially impossible |

This **one-way property** is the heart of the metaphor.

### The full colour exchange

Here is the complete paint analogy mapped to DH. Work through this with students
before using the app or alongside Teaching Mode:

```
         PUBLIC CHANNEL (Eve can see everything below the line)
─────────────────────────────────────────────────────────────────────

Step 1:  Alice and Bob agree on a PUBLIC colour (say, yellow).
         Eve sees this colour. That is fine.

Step 2:  Alice secretly picks BLUE. She tells nobody.

Step 3:  Bob secretly picks RED. He tells nobody.

Step 4:  Alice mixes PUBLIC (yellow) + her SECRET (blue)
         → she gets GREEN-ISH. She sends this to Bob.
         Eve intercepts it. She has the green-ish colour.
         But she cannot separate it back into yellow and blue.

Step 5:  Bob mixes PUBLIC (yellow) + his SECRET (red)
         → he gets ORANGE-ISH. He sends this to Alice.
         Eve intercepts it too.

Step 6:  Alice takes BOB'S MIX (orange-ish) + her SECRET (blue)
         → she gets BROWN-ISH.

         Bob takes ALICE'S MIX (green-ish) + his SECRET (red)
         → he also gets BROWN-ISH!

         Both have arrived at the SAME colour without ever sharing
         their secret colours.

Step 7:  Eve has: yellow, green-ish, orange-ish.
         If she mixes green-ish + orange-ish she gets WRONG COLOUR —
         she is missing one of the private colours.
```

### Why the colours converge (the maths behind the paint)

In the app, the final shared colour is computed as:

```
aliceFinal = (2/3 × bobMix)   + (1/3 × aliceSecret)
bobFinal   = (2/3 × aliceMix) + (1/3 × bobSecret)
```

Substituting the intermediate mixes:

```
aliceFinal = (2/3 × (½P + ½Sb)) + (1/3 × Sa)
           = P/3 + Sa/3 + Sb/3

bobFinal   = (2/3 × (½P + ½Sa)) + (1/3 × Sb)
           = P/3 + Sa/3 + Sb/3
```

Both reduce to the same formula — the average of all three colours — so they are
identical regardless of what P, Sa, and Sb are. This mirrors the real DH identity:

```
(g^a)^b ≡ (g^b)^a ≡ g^(ab)  (mod p)
```

Eve's attempt gives:

```
eveMix = ½ × aliceMix + ½ × bobMix
       = ½(½P + ½Sa) + ½(½P + ½Sb)
       = P/2 + Sa/4 + Sb/4
```

This is **not** equal to P/3 + Sa/3 + Sb/3, so Eve gets the wrong colour — just as
she would get the wrong key in real DH.

---

## 6. The real mathematics: Diffie-Hellman step by step

> **Level note:** This section is written for teachers and for students aiming at
> distinction grades or university applications. The core explanation in section 5
> is sufficient for pass/merit grades.

### Prerequisites students need

- Multiplication and division
- The concept of a remainder (modulo operation)
- Basic understanding of what a prime number is
- An intuition for why some operations are hard to reverse

### The modulo operation

`a mod n` means "the remainder when a is divided by n".

```
17 mod 5  =  2       (because 17 = 3×5 + 2)
24 mod 7  =  3       (because 24 = 3×7 + 3)
```

**Classroom demonstration:** Ask students to form a circle of 7 chairs numbered 1–7.
Count round, saying the number. When you say "mod 7" they tell you which chair that
person is in. Demonstrate that even large counts quickly produce a small result.

### Modular exponentiation

`g^a mod p` means "raise g to the power a, then take the remainder when divided by p".

**Example with small numbers:** Let g = 3, p = 17.

| a | 3^a | 3^a mod 17 |
|---|-----|-----------|
| 1 | 3   | 3         |
| 2 | 9   | 9         |
| 3 | 27  | 10        |
| 4 | 81  | 13        |
| 5 | 243 | 5         |
| 6 | 729 | 15        |
| 7 | 2187| 11        |
| 8 | 6561| 2         |

This looks like random output. Given only the result (say, 11), could you guess that
`a = 7`? Not easily — and with p having hundreds of digits, not at all.

### The discrete logarithm problem

The question *"Given g, p, and A = g^a mod p, find a"* is called the
**Discrete Logarithm Problem** (DLP).

- **Easy:** Given a, compute A = g^a mod p. (Computers can do this in milliseconds even for 2048-bit numbers.)
- **Hard:** Given A, recover a. (No known efficient algorithm; would take billions of years with current hardware for 2048-bit primes.)

This asymmetry is the mathematical foundation of Diffie-Hellman security.

### The complete DH protocol

**Setup (public):**
- Choose a large prime `p` (typically 2048 bits long — about 600 decimal digits).
- Choose a generator `g` (usually 2 or 5).
- Both `p` and `g` are published openly.

**Alice:**
1. Generates a random private key `a` (a large random number).
2. Computes her public value: `A = g^a mod p`
3. Sends `A` to Bob over the public channel.

**Bob:**
1. Generates a random private key `b`.
2. Computes his public value: `B = g^b mod p`
3. Sends `B` to Alice over the public channel.

**Deriving the shared secret:**
- Alice computes: `s = B^a mod p = (g^b)^a mod p = g^(ab) mod p`
- Bob computes:   `s = A^b mod p = (g^a)^b mod p = g^(ab) mod p`

Both get `g^(ab) mod p` — the same value — without ever transmitting their private keys.

**What Eve has:**
- `g`, `p`, `A = g^a mod p`, `B = g^b mod p`

To find the shared secret she needs either `a` or `b`. Finding these from `A` or `B`
is exactly the Discrete Logarithm Problem.

### Why the exponent rule holds modulo a prime

For any prime p and numbers a, b:

```
(g^a)^b mod p = g^(a×b) mod p = (g^b)^a mod p
```

This follows from **Fermat's Little Theorem** and the properties of modular arithmetic.
You do not need to prove this to students — it is enough to demonstrate it numerically.

**Worked example (classroom):** g = 5, p = 23.

```
a = 6,  b = 15

A = 5^6  mod 23 = 15625     mod 23 = 8
B = 5^15 mod 23 = 30517578125 mod 23 = 19

Alice:  B^a mod 23  = 19^6  mod 23 = 47045881     mod 23 = 2
Bob:    A^b mod 23  = 8^15  mod 23 = 35184372088832 mod 23 = 2  ✓
```

Both get 2. Ask students to try to find a or b from just A=8, B=19, g=5, p=23.
They can use trial and error with a calculator — but point out that real primes are
hundreds of digits long.

### Key sizes and modern usage

| Use case | Key size | Notes |
|----------|---------|-------|
| TLS 1.2 (legacy) | 1024-bit | Now considered inadequate |
| TLS 1.3 (current) | 2048–4096-bit DH, or 256-bit elliptic curve | Current standard |
| Long-term secure | 4096-bit DH or P-384 ECDH | Future-proofing |

**Elliptic Curve Diffie-Hellman (ECDH)** — a variant that uses points on an elliptic
curve instead of modular exponentiation — gives equivalent security with much smaller
keys and is the preferred choice in TLS 1.3.

---

## 7. Step-by-step teaching guide

### Suggested timing

| Phase | Activity | Duration |
|-------|---------|---------|
| Hook | Discussion question + class vote | 5 min |
| Explore | Teaching Mode, steps 1–3 | 10 min |
| Explain | Steps 4–6 with pause-and-discuss | 15 min |
| Eve fails | Step 7 + class discussion | 10 min |
| Apply | Simulation Mode — students interact | 15 min |
| Consolidate | Small-number worked example | 10 min |
| Assess | Exit ticket or written task | 5–10 min |
| **Total** | | **~70 min (one double lesson)** |

### Phase 1 — Hook (5 min)

Open with this question and ask students to vote by show of hands:

> *"Alice wants to send a secret code word to Bob. The only way they can communicate
> is by shouting across a crowded room where everyone can hear. Is it possible for
> them to agree on a secret that nobody else knows?"*

Most students will say no. Record the split on the board and return to it at the end.

### Phase 2 — Teaching Mode, Steps 1–3 (10 min)

Open the app in Teaching Mode. Walk through steps 1–3 as a whole-class activity,
projecting onto the whiteboard.

**Step 1 — Public colour:**
- Point out that the colour is visible to everyone.
- Ask: *"Does it matter if Eve knows this? Why not?"*
- Connect to DH: the prime p and generator g are genuinely public — anyone can use them.

**Step 2 — Alice's secret:**
- Emphasise: Alice never tells anyone. Not even Bob.
- Ask: *"How does a computer generate a truly random private key?"* (Brief discussion of
  pseudorandom number generators and cryptographically secure PRNGs.)

**Step 3 — Bob's secret:**
- Reinforce independence. Alice and Bob do not co-ordinate their secrets.
- Ask: *"What would happen if Alice and Bob picked the same secret colour?"* (In DH,
  A = B, so the shared secret = A^2 mod p; it is still secure, just a coincidence.)

### Phase 3 — Steps 4–6, pause-and-discuss (15 min)

**Step 4 — Alice sends her mixture:**

This is the crucial step. Pause here.

Draw on the board:
```
Alice has:  yellow + blue = green-ish
Eve intercepts: green-ish
Can Eve recover blue from green-ish?
```

Discussion: *In the real world, can you un-mix paint?* (No — mixing is irreversible.)
*What makes modular exponentiation like mixing?* (It is easy to compute A = g^a mod p,
but recovering a from A is computationally intractable.)

Key point for students to write down:
> **The one-way property** — easy to compute forward, infeasible to reverse — is the
> security of the entire protocol.

**Step 5 — Bob sends his mixture:**

Brief — same principle as step 4 but for Bob. Check for understanding:

*"Eve now has the public colour and both mixtures. What is she missing?"*
(Both private colours / private keys.)

**Step 6 — Final mix:**

This is the "magic" step. Both parties arrive at the same colour.

Ask students to predict before clicking Next: *"Will the colours match?"*

After revealing: *"Why do they match even though Alice added her colour to Bob's
mixture and Bob added his colour to Alice's mixture?"*

Walk through the paint-maths from section 5 at whatever depth is appropriate.

For stronger students, write the DH formula:
```
Alice: s = B^a mod p
Bob:   s = A^b mod p
Both: s = g^(ab) mod p   ← same value
```

### Phase 4 — Step 7 and Eve's failure (10 min)

Step 7 shows the red X for Eve's attempt.

Key questions:
- *"What would Eve need to know to reconstruct the shared secret?"* (One of the private keys.)
- *"Why can't she just try every possible private key?"* (With modern key sizes of 2048+ bits,
  trying all possible values would take longer than the age of the universe.)
- *"Is there any other attack she could try?"* (This opens discussion of man-in-the-middle
  attacks — see extension activities.)

### Phase 5 — Simulation Mode (15 min)

Hand over to students. Ask them to work in pairs:

1. **Basic task:** Each person in the pair picks a secret colour using the colour
   picker. Watch the shared secret update.
2. **Investigation:** Try to pick colours that make Eve's attempt as close as possible
   to the true shared secret. Can they get it to match? (They should find it very
   difficult without knowing the private colours.)
3. **Reasoning:** Why does the public colour affect the outcome but Eve still cannot
   reproduce it?

### Phase 6 — Small-number worked example (10 min)

Use the example from section 6 (g=5, p=23, a=6, b=15). Students should:

1. Compute A = 5^6 mod 23 on their calculators.
2. Compute B = 5^15 mod 23.
3. Verify Alice's secret = Bob's secret = 2.

Then present the challenge: *"Without being told a=6, can you find a just from A=8, g=5, p=23?"*
Students can use trial and error on their calculators. Emphasise that this gets
exponentially harder as the numbers get larger.

### Phase 7 — Consolidate and assess

Return to the opening question. Ask for a new show of hands.

**Exit ticket question** (write and hand in):

> *Explain, in your own words, how two people can agree on a shared secret over a
> public channel. Use the paint metaphor and include the terms 'public key',
> 'private key', and 'one-way function'.*

---

## 8. Classroom discussion questions

### Conceptual understanding

1. *"Why does it not matter that Eve can see the public colour and both mixtures?"*
2. *"What would happen to the security of DH if it were discovered that paint could
   somehow be un-mixed?"* (Link to: what if the DLP had an efficient solution?)
3. *"Alice and Bob have never met and live in different countries. They have never
   communicated privately before. How can they still establish a shared secret?"*
4. *"The public parameters (g and p) are the same for millions of HTTPS connections.
   Does this weaken security?"* (No — each connection generates fresh private keys a and b.)

### Applications and context

5. *"Every HTTPS website you visit runs a version of this protocol. How long do you
   think it takes?"* (Typically under 10 milliseconds on modern hardware.)
6. *"Your phone uses ECDH (Elliptic Curve DH) rather than classic DH. Why might a
   phone prefer smaller key sizes?"* (Processing power, battery life, bandwidth.)
7. *"DH on its own does not prove you are talking to the right person. What additional
   mechanism does HTTPS use to solve this?"* (Digital certificates / PKI / Certificate
   Authorities — a great bridge to the next topic.)

### Critical thinking and security

8. *"An attacker sits between Alice and Bob, intercepting and replacing all their
   messages. They pretend to be Bob when talking to Alice, and pretend to be Alice
   when talking to Bob. Could they break DH like this?"* (Yes — this is the
   Man-in-the-Middle attack; leads to the need for authentication.)
9. *"If quantum computers become powerful enough, they could solve the DLP efficiently
   using Shor's algorithm. What would this mean for HTTPS security today?"*
10. *"Some old websites still use 512-bit or 1024-bit DH keys. Researchers have shown
    these can be broken in days with specialised hardware. What should website owners do?"*

---

## 9. Assessment activities

### Formative — during lesson

**Exit ticket (5 min):**
Students write one sentence each explaining:
- What the one-way property is.
- Why Eve cannot reconstruct the shared secret.
- Where DH is used in the real world.

**Think-pair-share:** After step 6, ask pairs to explain to each other why the final
colours match. Listen for misconceptions (see section 11).

**Targeted questioning:** Use the questions from section 8, selecting appropriate
difficulty for the student.

### Summative — written tasks

**Task 1 — Merit level (150–250 words):**

> Using the paint-mixing metaphor, describe the Diffie-Hellman key exchange process.
> Your answer should explain the role of the public colour, Alice's and Bob's private
> colours, and what each party can and cannot see. Conclude by explaining why Eve
> cannot determine the shared secret even though she sees all the publicly transmitted
> information.

**Task 2 — Distinction level (250–400 words):**

> Explain the mathematical basis of the Diffie-Hellman protocol. In your answer:
> - Define the Discrete Logarithm Problem and explain why it is described as
>   'computationally infeasible'.
> - Show, using the example g = 5, p = 23, a = 4, b = 7, that Alice and Bob
>   arrive at the same shared secret.
> - Describe one practical limitation of Diffie-Hellman on its own and explain
>   what additional mechanism is used to overcome it.

**Task 3 — Research and evaluation (homework, approx. 500 words):**

> Research how TLS 1.3 uses Diffie-Hellman (or its variant, ECDH) in the HTTPS
> handshake. Write a structured explanation suitable for a non-technical manager
> at a company. Your explanation should cover: what happens when a browser connects
> to a secure website, why the connection is secure even though packets are visible
> to anyone on the network, and one risk that TLS does not fully address.

### Practical / scenario tasks

**Scenario task (group work, 20–30 min):**

*Your team has been hired as security consultants for a small online retailer. Their
IT team says they have implemented DH key exchange to protect customer passwords. Write
a briefing document (bullet points acceptable) that:*
- *Confirms this is a sound approach for protecting data in transit.*
- *Identifies two ways the system could still be compromised.*
- *Recommends one additional security measure.*

---

## 10. Extension activities

### For higher-attaining students

**Small-number DH with spreadsheet:**
Give students the following task in Excel or Google Sheets:
1. Create a column for `a` (1 to 30).
2. In the next column, compute `5^a mod 23` for each value.
3. Plot the results. Notice how random-looking they are despite coming from a simple formula.
4. Given only that the public value is 8, how many tries did it take to find a?
5. Now repeat with p = 104729 (a larger prime). How does the search space change?

**Implement DH in Python:**
```python
# Simple Diffie-Hellman demonstration
# Public parameters
g = 5
p = 23

# Alice's private key (secret)
a = 6
# Bob's private key (secret)
b = 15

# Public values (sent over the network)
A = pow(g, a, p)   # Alice's public value
B = pow(g, b, p)   # Bob's public value

print(f"Alice sends: A = {A}")
print(f"Bob sends:   B = {B}")

# Shared secret derivation
alice_secret = pow(B, a, p)
bob_secret   = pow(A, b, p)

print(f"Alice's secret: {alice_secret}")
print(f"Bob's secret:   {bob_secret}")
print(f"Match: {alice_secret == bob_secret}")
```

**Investigation questions for the Python task:**
- Try different values of a and b. Do they always match?
- What happens if you use a non-prime p?
- What happens if g is very small (e.g., g = 2)?
- Can you automate trying all values of a from 0 to p-1 to find the private key from A?
  How long does it take for p = 23? p = 10007? p = 1000003?

**Man-in-the-Middle attack diagram:**
Ask students to sketch (on paper or as a diagram) how an attacker (Mallory) could
sit between Alice and Bob, establish *separate* DH sessions with each, and decrypt all
traffic. Then ask: *"What does a digital certificate solve that DH alone cannot?"*

**Elliptic Curve DH research task:**
Research ECDH. Explain in 300 words: how it differs from classic DH, why it is
preferred in TLS 1.3, and what the equivalent of the Discrete Logarithm Problem is
in elliptic curve cryptography.

**Perfect Forward Secrecy (PFS):**
Research task on why TLS 1.3 requires ephemeral key exchange (fresh key pairs for
every session) rather than reusing long-term keys. Connect to the concept of
session key derivation and what happens if a long-term key is later compromised.

**Quantum threat — Shor's algorithm:**
Introduce Shor's algorithm (conceptually, not mathematically) and its ability to
solve the DLP on a quantum computer. Ask students to find out what post-quantum
key exchange algorithms are being standardised (NIST Post-Quantum Cryptography
project — ML-KEM, formerly CRYSTALS-Kyber).

---

## 11. Common misconceptions to address

### "Alice and Bob share their secret colours at some point"

**Misconception:** Students sometimes assume there must be a hidden step where the
private colours are exchanged.

**How to address:** In step 6, emphasise that Alice only ever receives Bob's *mixture*
(which contains the public colour blended in), not Bob's private colour. Likewise Bob.
The colours converge because of the mathematical symmetry, not because any secret was transmitted.

### "Eve just needs to be clever enough to separate the mixed colours"

**Misconception:** Mixing is reversible with the right technique (e.g., centrifuge, chromatography).

**How to address:** The paint is a *metaphor*, not a literal analogy. The actual operation
(modular exponentiation) has no known reversal algorithm for large primes. The specific
mathematical question — given g, p, A = g^a mod p, find a — has no efficient solution.
If such an algorithm existed, all internet security would be broken.

### "Bigger keys just slow things down a little bit"

**Misconception:** Students often underestimate how much harder brute force gets with
larger key sizes.

**How to address:** The number of possible private keys doubles with every additional bit.
A 2048-bit key has approximately 2^2048 possible values — roughly 3 × 10^616. At a
billion operations per second, trying all of them would take longer than the age of the
universe (13.8 billion years, approximately 4.4 × 10^17 seconds).

### "DH means the connection is fully secure"

**Misconception:** DH establishes a shared secret, therefore the communication is secure.

**How to address:** DH alone does not prove *who* you are talking to. A man-in-the-middle
can intercept and replace the DH exchange, establishing separate shared secrets with
both Alice and Bob without either noticing. This is why DH in TLS is combined with
digital certificates signed by a trusted Certificate Authority.

### "HTTPS means nobody can read the data"

**Misconception:** The padlock means perfect privacy.

**How to address:** HTTPS encrypts the *content* of requests and responses. It does not
hide the fact that you visited a site (the domain is visible in DNS and SNI), nor does it
protect against the server itself mishandling your data.

---

## 12. Glossary

| Term | Definition |
|------|-----------|
| **Asymmetric cryptography** | Encryption that uses a key pair: a public key (shared openly) and a private key (kept secret). DH is used to derive a shared secret, not to encrypt messages directly. |
| **Certificate Authority (CA)** | A trusted organisation that issues digital certificates, binding a public key to a verified identity. Browsers trust a pre-installed list of CAs. |
| **Cipher** | An algorithm for encrypting and decrypting data. |
| **Computational complexity** | A measure of how much time or memory an algorithm needs as the input size grows. The DLP is believed to have no polynomial-time solution. |
| **Cryptographic hash function** | A function that maps arbitrary data to a fixed-length output. Like modular exponentiation, it is easy to compute but hard to reverse. |
| **Diffie-Hellman (DH)** | A key exchange protocol allowing two parties to agree on a shared secret over a public channel, based on the hardness of the Discrete Logarithm Problem. |
| **Discrete Logarithm Problem (DLP)** | Given g, p, and A = g^a mod p, find a. No efficient classical algorithm is known for large primes. |
| **ECDH (Elliptic Curve DH)** | A variant of DH using elliptic curve mathematics. Achieves equivalent security with smaller key sizes. |
| **Encryption key** | A piece of data used by an encryption algorithm. In symmetric encryption, both parties use the same key. |
| **Ephemeral key** | A key used for only one session and then discarded. TLS 1.3 uses ephemeral keys for Perfect Forward Secrecy. |
| **Generator (g)** | In DH, a number used as the base for exponentiation. Usually a small number like 2 or 5. |
| **HTTPS** | HTTP over TLS (Transport Layer Security). Uses DH or ECDH for key exchange. |
| **Key exchange** | The process of agreeing on a shared cryptographic key between two parties. |
| **Man-in-the-Middle (MitM) attack** | An attack where an adversary intercepts and potentially alters communications between two parties, each of whom believes they are communicating directly with the other. |
| **Modular arithmetic** | Arithmetic where numbers wrap around after reaching a modulus (e.g., 17 mod 5 = 2). |
| **One-way function** | A function that is easy to compute but computationally infeasible to reverse. Modular exponentiation is believed to be one-way. |
| **Perfect Forward Secrecy (PFS)** | A property ensuring session keys are not compromised even if long-term secrets are later exposed. Achieved using ephemeral keys. |
| **Prime number** | A number greater than 1 divisible only by 1 and itself. DH uses very large primes for security. |
| **Private key** | A secret value known only to one party. In DH: a in g^a mod p. |
| **Public key** | A value derived from the private key and shared openly. In DH: A = g^a mod p. |
| **Session key** | A symmetric key used to encrypt a single communication session, derived via key exchange. |
| **Shared secret** | The common value both parties derive at the end of DH: g^(ab) mod p. Used as the basis for a session key. |
| **Symmetric encryption** | Encryption where both parties use the same key (e.g., AES). Fast, but requires a secure way to share the key — hence DH. |
| **TLS (Transport Layer Security)** | The cryptographic protocol underlying HTTPS. TLS 1.3 requires ephemeral DH or ECDH. |

---

## 13. Further reading and references

### For teachers (background)

- **Diffie, W. and Hellman, M.E. (1976).** *New Directions in Cryptography.*
  IEEE Transactions on Information Theory, 22(6), pp. 644–654.
  The original paper. Surprisingly readable; the abstract and introduction are
  accessible to students.

- **Ferguson, N., Schneier, B. and Kohno, T. (2010).** *Cryptography Engineering.*
  John Wiley & Sons. Comprehensive but accessible reference for practitioners and
  advanced students.

- **Menezes, A.J., van Oorschot, P.C. and Vanstone, S.A. (2018).** *Handbook of Applied
  Cryptography.* CRC Press. Available free online at cacr.uwaterloo.ca/hac/.
  Chapter 12 covers key agreement protocols.

### For students (accessible)

- **Computerphile YouTube channel** — search "Diffie Hellman - Computerphile" for an
  excellent 8-minute animated explanation with actual numbers.

- **Khan Academy — Cryptography section** — covers modular arithmetic and key exchange
  at a good level for T-Level students.

- **NCSC (National Cyber Security Centre)** — ncsc.gov.uk — real-world UK context for
  cryptography and the standards that protect government and commercial systems.

- **NIST Post-Quantum Cryptography project** — csrc.nist.gov/projects/post-quantum-cryptography
  — follow the standardisation of quantum-resistant algorithms that will eventually
  replace classic DH.

### Interactive tools

- **CrypTool 2** — cryptool.org — free, Windows-based tool for exploring classical
  and modern cryptography visually. Excellent for sixth-form enrichment.

- **Sage Math (online)** — sagecell.sagemath.org — perform modular exponentiation and
  explore DLP with larger numbers using Python-like syntax.

### Standards and specifications

- **RFC 7919** — Negotiated Finite Field Diffie-Hellman Ephemeral Parameters for TLS.
  The formal specification for DH key sizes in TLS.

- **RFC 8446** — The Transport Layer Security (TLS) Protocol Version 1.3.
  Mandates ephemeral key exchange (DHE or ECDHE), removing support for static DH.

---

## 14. Licence

This project — including the web app source code and this teacher resource — is released under the
**Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** licence.

### What this means for educators

| You may… | You may not… |
|---|---|
| Use and share the app freely in your classroom | Sell the app or this resource |
| Adapt, translate, or extend the materials | Remove or obscure the attribution |
| Host the app on a school or college server | Relicense derivatives under a more restrictive licence |
| Print or project any part of this document | Use the materials for commercial training courses |

### Attribution requirement

If you share or adapt these materials, please include an attribution such as:

> *Based on Paint Key Exchange by Simon Rundell, Exeter College, licensed under
> [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).*

The full licence text is available in the `LICENSE` file in the project root and at
https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.

---

*This resource was written for T-Level Digital and BTEC Level 3 Computing students aged 16–19.
It is designed to be used alongside the Paint Key Exchange web app.*

## Support

Created by Simon Rundell, 
Programme Leader, 
Dept of ITDD, Exeter College, 
Queen Street, Exeter EX4 4HS

email: simonrundell@exe-coll.ac.uk 
