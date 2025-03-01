# ediss_winter_school_hackathon_2025
This is Team's 3 repository for the project of the Winter School Hackathon 2025 of the EDISS master programme

![system architecture](https://github.com/user-attachments/assets/ab0285c2-c9bb-44c1-96cd-2881ed540eee)

### **Overview of the solution**

This solution is designed to enable real-time hazard detection using edge computing and cloud-based analytics. The architecture consists of several key components:

1. **Edge Device with AI-based Detection Model**  
   - A camera-equipped edge device captures video streams in real-time.  
   - A detection model, running on the edge device, processes the video feed to identify potential hazards.  
   - If a hazardous situation is detected, the system triggers an alert and publishes the detection event.  
   - The edge device can also provide immediate feedback to workers using visual indicators (e.g., red/green light signals).

2. **Message Broker (MQTT-based Communication)**  
   - The edge device publishes detection results to a message broker via the MQTT protocol.  
   - The broker distributes messages to different components, ensuring efficient and low-latency communication.

3. **Real-time Alerts and Notifications**  
   - If a hazardous situation is detected, an **alert** is generated and sent to the relevant personnel.  
   - Notifications are pushed to a **web application**, enabling managers to monitor incidents remotely.  

4. **Cloud-based Processing and Analytics**  
   - Detection events are sent to the cloud for further processing.  
   - The system stores detection data in a **database** for future analysis.  
   - A **backend microservice** processes the data and integrates with **analytics services** to generate insights.


## Instruction

Set up mosquito MQTT broker, database, and backend:

`docker compose up`

Set up edge device:
```
cd edge_device
python main.py
```

Deploy Front-end:
```
cd frontend
npm I
npm start
```

## Advantages
- Low latency due to edge inference.
- Real-Time on site intervention.
- Storage of historical data for retrospect.
- Decoupled-components.
- Easy to set up.
- Message queue for reliability.
- Platform-agnostic dashboard.
