# DATABASE SETUP INSTRUCTIONS

To connect your LifeOS to your Supabase database:

1. **Get your Connection String:**
   - Go to your Supabase Project Settings > Database.
   - Copy the "Transaction Connection String" (PostgreSQL).

2. **Add to .env:**
   - Open the `.env` file in the root of this project.
   - Replace the value of `DATABASE_URL` with your string.
   - It should look like: `DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres"`

3. **Initialize the Database:**
   - Run the following command in your terminal:
     `npx prisma db push`

4. **Verify:**
   - Restart the dev server if it was running: `npm run dev`

---

### IMPORTANT: YOU MUST DO THIS MANUALLY
For security reasons, I cannot ask you for your database password here. You must paste the full URL including your password into the `.env` file yourself.
