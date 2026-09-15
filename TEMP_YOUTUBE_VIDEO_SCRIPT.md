# AURA Brand Watches - YouTube Video Script

## Recording note

This is a natural speaking script, not a word-for-word performance requirement. Keep the delivery relaxed and conversational. Pause when moving between pages, and let the screen recording show the interface instead of trying to describe every pixel.

Suggested video length: 8 to 12 minutes.

## Before recording

1. Open Chrome in an Incognito window or disable browser extensions that inject overlays into web pages.
2. Open the deployed Vercel URL for the project.
3. Test the microphone before starting:
   - In Windows, open Settings > System > Sound > Input and speak while watching the input meter.
   - In Chrome, open the site settings from the lock icon, set Microphone to Allow, and reload the page.
   - Record a ten-second sample and play it back. Check that the voice is clear and there is no clipping or loud background noise.
4. Keep the microphone about 15 to 20 cm from your mouth and speak slightly past it rather than directly into it.
5. Have the deployed URL, a sample watch, and the demo checkout flow ready before pressing Record.

## Opening

[Camera on or voice-over. Show the Aura landing experience.]

"Hey everyone, welcome back to the channel. If you are new here, please subscribe because I share more practical development projects, UI experiments, and deployment walkthroughs here.

Today I am going to show you a project I built called Aura Brand Watches. It is a premium watch e-commerce website with a cinematic 3D-style experience, real product imagery, product browsing, authentication, a shopping cart, checkout, and a responsive interface that works across desktop, tablet, and mobile screens.

The goal was to make the experience feel more like visiting a luxury watch showroom than using a basic product grid. So let me walk you through what I built and how the main user journey works."

## Project overview and technology stack

[Show the home/dashboard page and briefly scroll through the hero section.]

"This project was built with a modern frontend stack. The main framework is Next.js with TypeScript, and the UI is powered by React 18.

For the visual experience, I used Framer Motion for interface transitions, GSAP and Lenis for motion and smooth scrolling, and React Three Fiber with Three.js for the 3D-ready watch experience. The project also uses Tailwind CSS for responsive styling and Lucide icons for the interface controls.

For state management, the shopping cart, wishlist, and user state are handled with Zustand. The project includes Supabase support for persistence, with a local browser storage fallback so the demo can still be explored without a live database connection.

The payment flow is intentionally running in test mode. It includes the payment screens and demo success or failure states, so nobody is charged while I am demonstrating the project."

## Desktop experience

[Move the cursor across the hero and show the cinematic watch showcase.]

"At the top of the website, you can see the cinematic watch showcase. The watch frames animate continuously, and the pointer interaction adds a subtle parallax effect. This gives the homepage some movement without making the page difficult to use.

The main call to action takes us to the collection. I have also added quick trust signals for certification, insured delivery, and the five-year warranty, because those details are important in an e-commerce experience for high-value products."

## Browsing watches

[Click Watches in the navigation.]

"Now I am going to open the Watches page. Each product card shows the exact product name, the reference, the movement, the case size, the product image, and the current market price.

The filters let us narrow the catalog by brand, and the search field makes it easy to find a particular brand or model. The layout changes automatically depending on the screen size. On a wide desktop screen there are several columns, on a tablet there are fewer columns, and on a phone it becomes a single-column list so the cards remain readable and the buttons remain easy to tap."

[Open one watch details page.]

"When I open a product, I get the detailed view with the larger image, product information, and the add-to-cart action. The viewer is designed to feel interactive, and the page keeps the important purchase information visible without making the user hunt for it."

## Authentication and cart

[Click Add to cart or show the login flow.]

"If I try to add a product before signing in, the website takes me to the login flow. New users can create an account, and returning users can sign in. This is also where the application preserves the pending cart item, so the shopping flow does not lose the product the customer selected.

After signing in, I can add the watch to the cart. The cart drawer opens from the side, shows the product, lets me change the quantity, and calculates the subtotal. On mobile, the drawer uses the full available width so the product details and checkout button do not get squeezed."

## Responsive mobile interface

[Resize the browser or switch to a phone-sized viewport.]

"Let us check the mobile experience as well. The navigation collapses into a menu, the search, wishlist, notification, cart, and account actions remain accessible, and the product cards stack vertically.

The hero content, buttons, watch showcase, filter controls, and checkout forms all adapt to smaller screens. I paid special attention to touch targets, readable spacing, and preventing horizontal scrolling. So this is not just a desktop page scaled down; the layout is designed to be comfortable on both mobile and desktop."

## Checkout and test payment

[Add a product, open checkout, and show the checkout steps. Do not use real payment details.]

"Next, I will show the checkout flow. The customer enters the delivery details, selects a payment method, and continues through the confirmation steps.

The payment integration is in test mode. That means this demo does not charge a real card or UPI account. After I continue, the demo bank screen lets me choose either Success or Failure so I can demonstrate both outcomes without using real financial information.

I will choose Success here. The order is saved with an order number, payment status, total, delivery estimate, and tracking placeholder. The confirmation and receipt screens then show the result of the completed checkout flow."

## What is next

[Show a few final pages: Limited Editions, Budget-Friendly, About, and the order confirmation.]

"There are also dedicated sections for limited-edition and budget-friendly watches, an About page, wishlist functionality, order history, profile screens, and admin-facing order and product views.

This gives the project the basic structure of a real e-commerce platform: product discovery, authentication, cart management, checkout, payment states, order confirmation, and responsive presentation. Large e-commerce companies such as Amazon and Flipkart follow this same general journey, even though their scale and infrastructure are much larger."

## Closing

[Return to the main dashboard or show the deployed URL.]

"That is the Aura Brand Watches project. I built it to combine a premium visual experience with the practical pieces needed for an e-commerce website: a product catalog, responsive UI, authentication, cart and wishlist state, checkout, and a test payment flow.

The project is deployed online, so you can open the link in the description and explore the pages yourself. Please remember that the payment flow is a demonstration and uses test mode only.

If you found this walkthrough useful, please subscribe to the channel and leave a comment telling me which part of the project you would like me to explain in a future video. You can also connect with me on LinkedIn by searching for Kanish. Send me a message there and let me know what you are building.

Thank you for watching until the end. I will see you in the next video. Bye."

## Optional short intro

"Hey everyone, welcome back to the channel. Today I am showing you Aura Brand Watches, a responsive Next.js and React e-commerce experience with cinematic watch visuals, product browsing, authentication, cart and wishlist features, and a test-mode checkout flow. Let us open the deployed website and see how it works."

## Optional short outro

"That is the complete walkthrough. The deployed link is in the description, and the payment flow is test mode only. Subscribe for more development projects, and I will see you in the next video."
