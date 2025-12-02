# Git Agentic

An agentic Git workflow system designed to let developers chat with their repository.

## Overview

Git Agentic uses Gemini (Gemini 2.5 Flash) for reasoning and text generation. More options will be provided later. The system currently supports 14 Git-related tools, including operations like creating and deleting branches, listing all branches, and more

## Installation

This project is still in very early stage and is being developed. It currently only supports this repository. Those who would like to try it out can clone this repository and follow the instructions below. Technically it can support any repository, but since it is in the prototype phase rather than a fully developed product, it's configured for this repo. Efforts on distribution (making it installed system-wide and make it usable in any repository) are yet to be put in.

### Prerequisites

- Node.js and npm
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Setup Steps

1. **Clone this repository**

   ```sh
   git clone https://github.com/Gita-App/git-agentic
   ```

2. **Install Bun and dependencies**

   Download and install Node.js and make sure npm (node package manager) is available.

   ```sh
   # Install bun (javascript runtime) globally
   npm install -g bun

   # Install packages
   npm install
   ```

3. **Configure your API key**

   Head over to [aistudio.google.com](https://aistudio.google.com) and grab a free Gemini API key. Copy the `.env.example` file and rename it to `.env`, then paste the Gemini API key in it.

4. **Start chatting with your repository**

   ```sh
   npm run chat
   ```

   You'll now be able to chat with your repository (well, this repository for now 😊)

## More

The initial ideation and development has been done by [Kartavya Patel](https://kartavyapatel.com). This project was the final project of the Generative A.I. and Software Development Lifecycle course taken by Kartavya at [FAU](https://fau.edu).
