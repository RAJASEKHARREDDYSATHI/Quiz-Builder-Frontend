import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If your frontend will be accessed like http://server:8080/frontend/
// then set base to '/frontend/'
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
 base: '/frontend/',   // <-- add this
=======
  base: '/frontend/',   // <-- add this
>>>>>>> 3628666548dec35a7874804ff50986c51258a350
})
