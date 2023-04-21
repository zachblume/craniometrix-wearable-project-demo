# Wearable Project - Sketch for Craniometrix

## My priorities in how I approached writing up this project proposal:

I wrote this proposal up with the aim of demonstrating my style of thinking/working in a couple of focus areas:

-   **System design for data and server architecture** of a system that can scale to 10,000 customers in the first three years
    -   One key thing I did here was to **always retain raw data for the most recent 6-month period**, providing ample time to strategize data aggregations before discarding the raw data. This approach enables us to introduce new features at any time while incorporating past behavior data when launching them. This required more complexity in the system design but is a huge win for delighting customers as we develop quickly.
-   **Clear writing on feature prioritization** in terms of delivering value to customers during the MVP stage
    -   **Also note: I actually decided to focus on developing the architecture for a feature you did not put in the spec**
    -   I did this because I think the most important valuable features are geofencing and fall detection, but their implementation is a little bit stragihtforward, and I wanted to show how I think beyond that
    -   The feature I chose was **labeling motion patterns with ML to create metrics of how the patient's memory is doing**, and whether or not they are maintaining stable routines.
-   A very basic demo UI that shows you a bit **more of my design sense**, how I think about UX, and shows more of my NextJS/React work
-   Demonstrating my approach to a **development timeline**

OK! Here it is:

![](/public/homepage2.png)

## Introduction

I’m excited to present this proposal for moving forward our launch of an Apple Watch integration designed to improve care delivery for Alzheimer's patients. Our aim is to pioneer continuous monitoring in order to provide predictive insights that lead to more timely interventions, improving the health and quality of life for patients suffering from Alzheimer's disease.

The watch integration will improve patient care by addressing the challenges faced by both caregivers and healthcare providers in Alzheimer's care.

Family caregivers often struggle to balance medical and non-medical tasks while striving to accurately assess their loved one's condition. Our solution provides continuous monitoring, allowing caregivers to focus on other responsibilities without the need for constant co-presence. Additionally, it generates a precise record of the patient's health, fostering collaboration and trust among all parties involved.

In the current healthcare landscape, providers primarily depend on periodic inpatient assessments, which might not offer a comprehensive picture of the patient's condition. Our platform not only improves the amount and quality of data available to providers, but fosters trust by establishing an objective and continuous factual record for both healthcare providers and caregivers to access.

In summary, these are the keys improvement areas we can deliver:

-   **Continuous** patient monitoring
-   **Real-time** health data visualization
-   Ability to **notify in realtime**, without requiring co-presence
-   **Improve accuracy** of metrics
-   **Expand** metrics available
-   **Create objectivity** and **reliable documentation**
-   **Foster trust** between caregivers and HC providers via objective record
-   Shorten the feedback loop by **providing personalized recommendations**
-   **Reduce silos** by rolling up general health metrics in a comprehensive platform
-   **Reduce routine man-hours** required for assessments by caregivers.
-   Enable **earlier detection** of potential health issues
-   Make it easier to identify complex insights in **long-term** patient progress data
-   **Reduce the emotional burden** on caregivers
-   **Reduce the workload in sharing** monitoring + assessment data with HC system integrations

Our product development selection, prioritization, and timing is based on the principle of addressing the biggest gaps among these potential impact areas for customers, given that the primary deciding customer for this technology at first will be family caregivers.

## Key Features

-   Geofencing for wandering protection
-   Fall detection and realtime alert notification
-   **Label motion patterns with ML to create objective memory metrics:**
    -   **How long are routine tasks taking? (bedroom, bathroom, typical eating wrist pattern)**
    -   **Has the patient missed routine tasks lately, or have they been delayed/slow?**
-   Gait and balance tracking
-   Produce insights from heart rate, blood oxygen, and sleep pattern analysis
-   Personalized Recommendations
-   Metrics visualization

### System design

#### Priorities:

-   Development speed especially for MVP featureset (0 to 1)
-   High availability at initial scale for datapoint ingestion and critical realtime notifications
-   Schema and typesafety for production reliability
-   Enough backwards storage to launch new features with the raw data
-   Ease of transition to a more scalable system down the line

#### Data storage

The initial maximum scale is 10,000 customers in the first three years.

We plan to store raw once-per-second readings for up to 6 months and then store aggregations beyond 6mo indefinitely from all our sensors (heart, temperature, orientation, location).

Let’s calculate the practicality of storing one datapoint per second:

-   Each device generates a .5kb data point set, at a granularity of 1/sec.
-   10,000 customers X 86400 seconds/day is 2 billion rows of data per day
-   2 terabytes of data per day, resulting in 30 terabytes per month
-   TimescaleDB (TSDB) is an open-source addon to PostgreSQL that provides compression + query optimization specifically for time-series data.
-   It cannot be run on RDS – but we can standup two copies of the master DB for failover.
-   TSDB lossless compression rates are around 95%.
-   5% size X 2 master DB copies = 10%
-   10% of 30 terabytes is 3 terabytes per month of compressed data storage needed total
-   That’s 18 terabytes of compressed data per 6 months (including duplicate)
-   Run a daily job that performs daily aggregations and discards raw data older than 6 months, reducing storage needs by >99.9% (1/86,000).
-   Over three years, the additional 0.1% of aggregate data only adds up to an additional 3.6%.
-   That’s $1440/month for storage, at 8 cents per gigabyte AWS Elastic Block Storage costs
-   We’re still storing around 18 terabytes, so the yearly storage cost is $18,000/year.
-   That’s $1/year/customer with fairly linear scaling costs

#### Server capacity:

-   Apple watches connect to a RabbitMQ instance behind a network load balancer for replication - with 10,000 connected devices posting 1kb once per second each, we only theoretically need 1 server because each RabbitMQ server on a mid sized VM can handle about >40k messages/s. We'll configure at least two though, for instant failover protection behind the network load balancer. We'll configure the apple watch app itself to exponentially backoff retries if it can't connect to the RabbitMQ instance, preventing us from DDOSing our own server if the server blocks publisher connections based on the `vm_memory_high_watermark`.
-   We have enabling queueing on the RabitMQ instance (uses native MQTT but implements AMQP internally within a node for queueing)
-   There’s another network load balancer for incoming subscription connections to the broker
-   The (replicated) subscriber application takes messages and posts them using INSERT through pgbouncer to a timescaledb/postgres isntacne. For the same capacity, we’ll only need 1 number of instances, but we'll have 2 for instant failover.
-   At 10k clients, we can batch 25 rows together in memory and only do 400 transactions/second. We’re still doing 10k INSERTs/second but a single TimescaleDB node can handle 50-100k INSERTs/second. Multi-node can scale to millions per second giving additional runway if we split out rows at some point as a transformation.

### System design for raw data ingestion:

![System design for raw data ingestion](/public/system-design-1.png)

#### System design for realtime notifications

Stream-based system design for realtime (<2s) notifications (did a fall occur, are we outside geofence):

-   Instead of building a overly complex realtime analytics stream with Apache Kafka, etc, - we’re going to embed the logic for FALL and GEOFENCE in the actual WatchOS app
-   If these occur, we’re going to post to a seperate endpoint (much more rarely), can be a Lambda for simplicity
-   That’s going to trigger a notification service (we can use SES/SNS for simplicity here)

#### System design for predictive/analytical notifications

Cron-based system design for predictive notifications (is balance off/a fall may be likely?) and analytical notifications (are today’s routine activity patterns diverging significantly from normal?)

-   Schedule a periodic job to analyze stored data and generate predictive and analytical notifications.
-   The job will calculate a couple of metrics for each day:
    -   Count and durations of eating (wrist pattern))
    -   Count and durations of sleep
    -   Count and durations of time in bedroom post-sleep (getting ready routine)
    -   Count and durations of walking
    -   Balance and gait metrics
-   Then there will be a comparison of these count/duration pairs to the previous 7 days, and if there’s a significant difference or whether it is trending towards significance over several days. Once we have user data, we can also train a ML model to do feature selection and prediction, and then measure the trending difference between prediction and actual results for inference.
-   We'll store the results of that in the application DB

#### System design for user interface:

-   Utilize Supabase as a simple bakend/BaaS to handle user authentication and API calls.
-   It uses a little server running PostgREST api/kong gateway as a thin layer over Postgres.
-   It also has a realtime websocket layer for realtime updates for when we want to add that - during early production we can also just turn on 250ms polling for all the client calls for realtime-lite, and be confident that PostgREST will be able to handle it.
-   We'll using Postgres foreign data wrapper to connect the seperate Postgres database which is running TimescaleDB and storing the raw data, along with indexes, etc. This will allow us to query the raw data directly from the frontend while also not mixing our raw data with our application data stores.

## Development timeline

Week 1-2: Research and Planning

-   Research Apple Watch capabilities and limitations, along with any relevant APIs and SDKs.
-   Further develop a detailed project plan with clear milestones and deliverables.
-   Identify and set up necessary tools and platforms for the development process, set up repositories, set up test instances of each part of the backend and frontend.
-   Produce the WatchOS app and test it on a physical Apple Watch to start trasnmitting the raw data from sensors.
-   Scaffold out the only built-in logic -- fall and geofence -- for initial testing with hardcoded values.

Week 3-4: Backend Infrastructure Development

-   Set up the RabbitMQ instances and network load balancers.
-   Configure PG, Pgbouncer and TimescaleDB/PostgreSQL instances.
-   Implement the data ingestion pipeline, including the subscriber application and data storage in TimescaleDB.
-   Test and optimize data ingestion to ensure system reliability and performance.

Week 5-6: Real-time and Cron-based Notification Systems

-   Configure the delivery mechanism for real-time notifications (email, SMS, or push notifications).
-   Scaffold out the cron-based job for generating predictive/analytical notifications.
-   Test and optimize both real-time and cron-based notification systems.

Week 7-8: Demo UI and Backend User Interface

-   Design and develop a demo UI showcasing key features and functionality.
-   Set up Supabase as the backend for user authentication, and API calls.
-   Integrate user interface components with backend APIs.

Week 9-10: Testing, Debugging, and Optimization

-   Perform thorough end-to-end testing of the system.
-   Identify and fix bugs + performance bottlenecks.
-   Optimize system performance and reliability.
-   Finalize documentation and code quality.

Week 11-12: Fleshing out the Routine-based Metrics

-   Flesh out the routine-based metrics (eating, sleep, getting ready, walking, balance, gait)
-   Test and optimize the cron-based notification system.

Week 14-16: Soft Launch and User Testing

-   Perform a soft launch of the MVP with a limited group of users.
-   Collect user feedback and make necessary adjustments based on the feedback.
-   Continue testing and optimizing the system.
-   Plan and prepare for the full launch of the MVP.
-   Instrument the code and set up monitoring tools to track system performance and user behavior.

Week 17: Full Launch and Post-launch Support

-   Launch the MVP to the target audience.
-   Provide fixes and support for any issues that may arise.
-   Monitor system performance and user feedback to identify areas for improvement.

Throughout the entire development timeline, maintain close communication with the project team and stakeholders to ensure alignment and address any issues that may arise.

## Demo UI for Caregiver application

Take a look at:

https://craniometrix-wearable-project-demo.vercel.app

### Notes on UI demo:

-   Shows an example UI flow for recommendations based on personalized analysis of activity patterns
-   Shows the absolute basic/begining flow for drawing a geofence
-   The UI is built with React and Next.js, hosted on Vercel
-   Uses Supabase for authentication and backend
-   Ready to use the Supabase JS client to make API calls to the backend (didn't get to fleshing this out)
-   Tailwind CSS for styling
