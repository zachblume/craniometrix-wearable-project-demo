# Wearable Project - Sketch for Craniometrix

![](/public/homepage.png)

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

-   Gait and balance tracking
-   Fall detection and realtime alert notification
-   Geofencing for wandering protection
-   Label motion patterns with ML to create objective memory metrics:
-   How long are routine tasks taking? (bedroom, bathroom, typical eating wrist pattern)
-   Has the patient missed or delayed routine tasks lately?
-   Produce insights from heart rate, blood oxygen, and sleep pattern analysis
-   Personalized Recommendations
-   Metrics Visualization

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

-   Apple watches connect to a RabbitMQ instance behind a network load balancer for replication - with 10,000 connected devices posting 1kb once per second each, we’ll need BLANK servers
-   We have enabling queueing on the MQTT instance
-   There’s another network load balancer for incoming subscription connections to the broker
-   The (replicated) subscriber application takes messages and posts them using INSERT through pgbouncer to a timescaledb/postgres isntacne. For the same capacity, we’ll need BLANK number of replicated instances of this flow
-   At 10k clients, we can batch 25 rows together in memory and only do 400 transactions/second. We’re still doing 10k INSERTs/second but a single TimescaleDB node can handle 50-100k INSERTs/second. Multi-node can scale to millions per second giving additional runway if we split out rows at some point as a transformation.

### System design for raw data ingestion:

![System design for raw data ingestion](/public/system-design-1.png)

#### System design for realtime notifications

Stream-based system design for realtime (<2s) notifications (did a fall occur, are we outside geofence):

-   Instead of building a overly complex realtime analytics stream with Apache Kafka, etc, - we’re going to embed the logic in the apple watch for FALL and GEOFENCE
-   We’re going to post to another endpoint (much more rarely)
-   That’s going to trigger a notification service (we can use AWS SES/SNS)

#### System design for predictive/analytical notifications

Cron-based system design for predictive notifications (is balance off/a fall may be likely?) and analytical notifications (are today’s routine activity patterns diverging significantly from normal?)

-   Schedule a periodic job (e.g., using cron or Airflow) to analyze stored data and generate predictive and analytical notifications.
-   Notifications are sent through a suitable delivery mechanism such as email, SMS, or push notifications.

System design for user interface:

-   Utilize Supabase as the backend to handle user authentication, storage, and API calls.
-   Build a responsive web or mobile application to display metrics, visualizations, and notifications to users.

## Development timeline

Week 1-2: Research and Planning

-   Research Apple Watch capabilities and limitations, along with any relevant APIs and SDKs.
    Develop a detailed project plan with clear milestones and deliverables.
-   Identify and set up necessary tools and platforms for the development process.

Week 3-4: Backend Infrastructure Development

-   Set up the RabbitMQ instances and network load balancers.
-   Configure Pgbouncer and TimescaleDB/PostgreSQL instances.
-   Implement the data ingestion pipeline, including the subscriber application and data storage in TimescaleDB.
-   Test and optimize data ingestion to ensure system reliability and performance.

Week 5-6: Real-time and Cron-based Notification Systems

-   Implement the backend for receiving real-time notifications.
-   Configure the delivery mechanism for real-time notifications (email, SMS, or push notifications).
-   Set up a cron-based job for generating predictive and analytical notifications.
-   Test and optimize both real-time and cron-based notification systems.

Week 7-8: Demo UI and Backend User Interface

-   Design and develop a demo UI showcasing key features and functionality.
-   Set up Supabase as the backend for user authentication, storage, and API calls.
-   Develop the user interface using preferred frontend technologies.
-   Integrate user interface components with backend APIs.

Week 9-10: Testing, Debugging, and Optimization

-   Perform thorough end-to-end testing of the system.
-   Identify and fix bugs or performance bottlenecks.
-   Optimize system performance and reliability.
-   Finalize documentation and code quality.

Week 11-12: Soft Launch and User Testing

-   Perform a soft launch of the MVP with a limited group of users.
-   Collect user feedback and make necessary adjustments based on the feedback.
-   Continue testing and optimizing the system.
-   Plan and prepare for the full launch of the MVP.

Week 13: Full Launch and Post-launch Support

-   Launch the MVP to the target audience.
-   Provide ongoing support, maintenance, and updates.
-   Monitor system performance and user feedback to identify areas for improvement.

Throughout the entire development timeline, maintain close communication with the project team and stakeholders to ensure alignment and address any issues that may arise. This timeline is subject to change based on the complexity of the implementation and any unforeseen challenges during the development process.

## Demo UI for Caregiver application

Take a look at:

https://craniometrix-wearable-project-demo.vercel.app

### Notes on UI demo:

-   Shows an example UI flow for recommendations based on personalized analysis of activity patterns
-   The UI is built with React and Next.js, hosted on Vercel
-   Uses Supabase for authentication and backend
-   Uses the Supabase JS client to make API calls to the backend
-   Uses the Supabase Realtime client to subscribe to realtime notifications
-   Tailwind CSS for styling
-   E2E testing with Playwright
