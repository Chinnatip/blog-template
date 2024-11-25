# Instructions for Running the Application

Follow these steps to set up and run the application:

---

## **Steps to Start the Application**
1. Start Colima (Docker environment):
   ```bash
   colima start
   ```

2. Check running Docker containers:
   ```bash
   docker ps
   ```

3. Build and start the services using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

4. Verify the container status:
   ```bash
   docker ps
   ```

---

## **Accessing the Application**
- **Prisma Studio (Database Management):**  
  Access the database at:  
  [http://localhost:5555](http://localhost:5555)

- **Backend API:**  
  Running at:  
  [http://localhost:4000](http://localhost:4000)

- **Frontend Website:**  
  Running at:  
  [http://localhost:3000](http://localhost:3000)

---

## **Troubleshooting**
### If the website does not run:
1. Navigate to the `frontend` directory:
   ```bash
   cd /frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Rebuild and restart the services:
   ```bash
   docker-compose up -d --build
   ```

This should ensure the server and website run correctly.

---
