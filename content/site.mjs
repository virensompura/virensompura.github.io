// Single source of truth for all site content.
// Every fact below is taken from the CV (assets/Viren_Sompura_Resume_1.pdf), the previous
// version of this website, or public GitHub repositories. Do not add unverified claims.
// Fields marked `TODO(owner)` are intentionally empty: sections without data are not rendered.

export const site = {
  url: 'https://virensompura.github.io',
  name: 'Viren Sompura',
  role: 'Robotics Engineer',
  tagline: 'Engineering autonomous systems, from hardware to intelligence.',
  intro: 'I design, integrate, and develop robotic systems by bringing together embedded electronics, control systems, ROS 2, perception, simulation, and autonomous navigation.',
  description: 'Viren Sompura is a Robotics Engineer working across ROS 2, autonomous navigation, SLAM, embedded systems, and robot hardware-software integration.',
  location: 'India',
  email: 'sompuraviren03@gmail.com',
  resume: 'assets/Viren_Sompura_Resume_1.pdf',
  ogImage: 'assets/img/og-image.jpg',
  portrait: { src: 'assets/img/viren-sompura.webp', w: 330, h: 432, alt: 'Portrait of Viren Sompura' },
  links: {
    linkedin: 'https://www.linkedin.com/in/viren-sompura/',
    github: 'https://github.com/virensompura',
    x: 'https://x.com/VirenSompura01',
  },
  // Public Web3Forms access key (designed to be exposed client-side; it can only send mail to the owner).
  web3formsKey: '84e28f1a-b396-4280-8df7-ad8e169b9cb7',
  roboticsSince: 'Sept 2023',
};

// Engineering domains used for project filters.
export const categories = {
  autonomy: 'Autonomous Robotics',
  ros2: 'ROS 2 & Navigation',
  embedded: 'Embedded Systems',
  hardware: 'Hardware & Control',
};

const img = (file, w, h, alt, pos) => ({ src: `assets/img/projects/${file}`, w, h, alt, pos });

export const projects = [
  {
    id: 'curio',
    title: 'Curio — Museum Guidance Robot',
    short: 'Guidance robot for the Kolkata Museum that navigates the exhibit halls and answers visitor questions about science and technology exhibits.',
    domain: 'Autonomous Robotics',
    categories: ['autonomy', 'ros2', 'hardware'],
    status: 'Completed',
    context: 'Vama Communications Pvt. Ltd. — R&D',
    role: 'Led the development of the robot’s hardware and software in the R&D department.',
    tech: ['ROS 2', 'Nav2', 'SLAM', 'Jetson Nano', 'Atmega2560', 'PCB design'],
    cover: img('curio-museum.webp', 960, 720, 'Curio guidance robot standing in a gallery at the Kolkata Museum', '50% 30%'),
    video: { src: 'assets/videos/curio_robot.mp4', poster: 'assets/img/posters/curio.webp', w: 1280, h: 720 },
    overview: 'Curio is a wheeled guidance robot built for the Kolkata Museum. Visitors can interact with the robot, ask science and technology questions, and hear explanations of the museum’s exhibits.',
    objective: 'Give museum visitors an interactive guide that can move through the galleries and explain every exhibit.',
    contributions: [
      'Led development of Curio’s hardware and software within the R&D department.',
      'Designed and implemented custom PCB solutions for the robot.',
      'Implemented ROS 2-based navigation and SLAM on a Jetson Nano.',
      'Developed software modules to reduce overall system latency.',
    ],
    problem: null, // TODO(owner): engineering problem, constraints, desired outcomes
    architecture: [
      { name: 'Interaction', items: ['Visitor question & answer about science and technology exhibits'] },
      { name: 'Autonomy & compute', items: ['Jetson Nano', 'ROS 2 navigation (Nav2)', 'SLAM'] },
      { name: 'Embedded electronics', items: ['Atmega2560 microcontroller', 'Custom PCBs'] },
    ],
    hardware: [
      { group: 'Main compute', items: ['NVIDIA Jetson Nano'] },
      { group: 'Microcontroller', items: ['Atmega2560'] },
      { group: 'Electronics', items: ['Custom-designed PCBs'] },
      // TODO(owner): sensors, motors, drivers, power system
    ],
    software: ['ROS 2', 'Nav2', 'SLAM'],
    challenges: [], // TODO(owner): real engineering challenges and how they were solved
    results: [
      'Robot autonomy improved by 40% after implementing ROS 2 navigation and SLAM (as stated in CV).',
      'System latency reduced by 25% through new software modules (as stated in CV).',
    ],
    gallery: [
      img('curio-museum.webp', 960, 720, 'Curio in a museum gallery'),
      img('curio-corridor.webp', 1200, 676, 'Curio beside an exhibit hall at the museum'),
    ],
    resources: [
      { label: 'Project video', href: 'https://drive.google.com/file/d/1SGBgsC9yg2MlOd70hP9E2P-MdjG-vpHD/view?usp=sharing', note: 'Google Drive' },
    ],
  },
  {
    id: 'ros2-robot-development',
    title: 'ROS 2 Robot Development & Testing',
    short: 'Visual SLAM, 3D mapping, autonomous docking, an RS-485 motor driver, and micro-ROS firmware on FreeRTOS, integrated on a ROS 2 mobile robot.',
    domain: 'ROS 2 & Embedded Systems',
    categories: ['ros2', 'embedded', 'autonomy', 'hardware'],
    status: 'Completed',
    context: null,
    role: null, // TODO(owner): context (employer / personal) and role
    tech: ['ROS 2', 'Nav2', 'ORB-SLAM3', 'RTAB-Map', 'micro-ROS', 'FreeRTOS', 'RS-485'],
    cover: img('ros2-dev-1.webp', 720, 1280, 'Mobile robot platform used for ROS 2 development and testing', '50% 45%'),
    video: { src: 'assets/videos/rs-com.mp4', poster: 'assets/img/posters/ros2-robot-development.webp', w: 1280, h: 720 },
    overview: 'A body of ROS 2 development and testing on a mobile robotic platform, spanning perception and mapping, autonomous docking, operator tooling, motor communication, and real-time embedded firmware.',
    objective: 'Integrate perception, navigation, and embedded control into one reliable ROS 2 robot stack.',
    contributions: [
      'Integrated ORB-SLAM3 with ROS 2 and Nav2 for real-time visual SLAM and localization.',
      'Implemented RTAB-Map for 3D mapping and loop-closure detection.',
      'Developed auto-docking using a static docking-station TF frame and NavigateToPose.',
      'Built a web interface for remote control and monitoring via ROS 2 topics and services.',
      'Engineered an RS-485 interface for DDSM115 motors with multi-channel, synchronized control.',
      'Deployed micro-ROS on embedded MCUs for wheel encoders, LEDs, INA219 power sensors, and stepper motors.',
    ],
    problem: null, // TODO(owner)
    architecture: [
      { name: 'Operator', items: ['Web control & monitoring interface', 'ROS 2 topics and services'] },
      { name: 'Autonomy', items: ['ORB-SLAM3 + Nav2 (visual SLAM, localization)', 'RTAB-Map (3D mapping, loop closure)', 'Auto-docking (docking-station TF frame + NavigateToPose)'] },
      { name: 'Embedded', items: ['micro-ROS on MCUs', 'FreeRTOS tasks & inter-task communication'] },
      { name: 'Hardware', items: ['DDSM115 motors over RS-485', 'Wheel encoders', 'INA219 power sensors', 'Stepper motors', 'LEDs'] },
    ],
    hardware: [
      { group: 'Motors', items: ['DDSM115 motors (RS-485)', 'Stepper motors'] },
      { group: 'Sensors', items: ['Wheel encoders', 'INA219 power sensors'] },
      { group: 'Embedded', items: ['Microcontrollers running micro-ROS'] },
      { group: 'Communication', items: ['RS-485 (multi-channel)'] },
      // TODO(owner): main compute unit, cameras used for ORB-SLAM3 / RTAB-Map, power system
    ],
    software: ['ROS 2', 'Nav2', 'ORB-SLAM3', 'RTAB-Map', 'micro-ROS', 'FreeRTOS', 'Web interface over ROS 2 topics & services'],
    challenges: [
      { title: 'Deterministic sensor sampling on microcontrollers', body: 'Implemented FreeRTOS task scheduling and inter-task communication so sensor sampling stays deterministic and actuators run smoothly.' },
      { title: 'Control-loop jitter', body: 'Performed real-time profiling and firmware optimizations to bring control-loop jitter below 5 ms and improve resource efficiency.' },
      { title: 'Synchronized multi-motor communication', body: 'Engineered an RS-485 protocol interface for DDSM115 motors, enabling multi-channel communication and synchronized motor control.' },
      { title: 'Repeatable docking', body: 'Defined the docking station as a static TF frame and drove the robot to it with Nav2’s NavigateToPose action.' },
    ],
    results: ['Control-loop jitter reduced below 5 ms after firmware profiling and optimization.'],
    gallery: [
      img('ros2-dev-1.webp', 720, 1280, 'Robot platform during ROS 2 testing'),
      img('ros2-dev-2.webp', 720, 1280, 'Robot hardware during RS-485 communication testing'),
    ],
    resources: [
      { label: 'Project files', href: 'https://drive.google.com/drive/folders/1UoL6GgpReF8u6i3Q7rhB1vBSPKt9ppLa?usp=sharing', note: 'Google Drive' },
    ],
  },
  {
    id: 'amr-lidar',
    title: 'Autonomous Mobile Robot with LiDAR & A* Planning',
    short: 'AMR prototype with a Raspberry Pi 4 for ROS and an Arduino Mega for low-level control, mapping obstacles with an RPLiDAR A1M8 and planning paths with A* search.',
    domain: 'Autonomous Robotics',
    categories: ['autonomy', 'ros2', 'hardware'],
    status: 'Completed',
    context: null,
    role: null, // TODO(owner)
    tech: ['ROS', 'RPLiDAR A1M8', 'A* search', 'Raspberry Pi 4', 'Arduino Mega'],
    cover: img('amr-1.webp', 720, 1282, 'Autonomous mobile robot prototype with a LiDAR sensor', '50% 55%'),
    video: { src: 'assets/videos/amr-lidar.mp4', poster: 'assets/img/posters/amr-lidar.webp', w: 1280, h: 720 },
    overview: 'A prototype autonomous mobile robot that maps obstacles in real time with a 2D LiDAR and plans collision-free paths with the A* search algorithm.',
    objective: 'Demonstrate real-time obstacle mapping and path planning on low-cost compute.',
    contributions: [
      'Built the AMR prototype with a Raspberry Pi 4 for ROS integration and an Arduino Mega for low-level hardware control.',
      'Implemented real-time obstacle mapping with an RPLiDAR A1M8.',
      'Implemented navigation using the A* search algorithm.',
    ],
    problem: null, // TODO(owner)
    architecture: [
      { name: 'Sensing', items: ['RPLiDAR A1M8 (2D LiDAR)'] },
      { name: 'High-level compute', items: ['Raspberry Pi 4', 'ROS integration', 'Real-time obstacle mapping', 'A* path planning'] },
      { name: 'Low-level control', items: ['Arduino Mega (hardware control)'] },
    ],
    hardware: [
      { group: 'Main compute', items: ['Raspberry Pi 4'] },
      { group: 'Microcontroller', items: ['Arduino Mega'] },
      { group: 'Sensors', items: ['RPLiDAR A1M8'] },
    ],
    software: ['ROS', 'A* search', 'Real-time obstacle mapping'],
    challenges: [],
    results: [],
    gallery: [
      img('amr-1.webp', 720, 1282, 'AMR prototype'),
      img('amr-2.webp', 720, 1282, 'AMR prototype during a navigation run'),
    ],
    resources: [
      // TODO(owner): this Drive folder is identical to the Humanoid project's link on the previous site — please verify.
      { label: 'Project files', href: 'https://drive.google.com/drive/folders/1bC7ev7NMXQ1dkGp74KphR3cCT3R6wxd7?usp=drive_link', note: 'Google Drive' },
    ],
  },
  {
    id: 'ros2-sensor-drivers',
    title: 'ROS 2 Sensor Drivers & Fusion',
    short: 'Custom ROS 2 drivers for a Qwiic ICM-20948 IMU and a VL53L0X time-of-flight sensor, with a sensor-fusion algorithm for localization and obstacle detection.',
    domain: 'ROS 2 & Embedded Systems',
    categories: ['ros2', 'embedded'],
    status: 'Completed',
    context: null,
    role: null,
    tech: ['ROS 2', 'ICM-20948 IMU', 'VL53L0X ToF', 'I²C', 'Sensor fusion'],
    cover: img('sensor-1.webp', 848, 480, 'IMU data visualized during ROS 2 sensor integration', '50% 50%'),
    video: { src: 'assets/videos/IMU-Integration-ROS2.mp4', poster: 'assets/img/posters/ros2-sensor-drivers.webp', w: 848, h: 480 },
    overview: 'Driver development and sensor fusion for low-cost robot sensors, bringing an IMU and a time-of-flight range sensor into the ROS 2 ecosystem.',
    objective: 'Improve the accuracy and reliability of robot localization and obstacle detection.',
    contributions: [
      'Developed custom ROS 2 drivers for the Qwiic ICM-20948 IMU and the VL53L0X ToF distance sensor.',
      'Engineered a sensor-fusion algorithm to improve localization and obstacle detection.',
    ],
    problem: null,
    architecture: [
      { name: 'Sensors', items: ['ICM-20948 9-axis IMU (Qwiic / I²C)', 'VL53L0X time-of-flight range sensor (I²C)'] },
      { name: 'ROS 2 drivers', items: ['Custom driver node per sensor'] },
      { name: 'Fusion', items: ['Sensor-fusion algorithm', 'Localization & obstacle detection'] },
    ],
    hardware: [
      { group: 'Sensors', items: ['SparkFun Qwiic ICM-20948 IMU', 'VL53L0X ToF distance sensor'] },
    ],
    software: ['ROS 2', 'Custom sensor drivers', 'Sensor fusion'],
    challenges: [],
    results: ['Qualitative: improved accuracy and reliability of localization and obstacle detection. No quantitative benchmark has been published yet.'],
    gallery: [
      img('sensor-1.webp', 848, 480, 'IMU integration in ROS 2'),
      img('sensor-2.webp', 848, 480, 'Sensor data during testing'),
    ],
    resources: [
      { label: 'vl53l0x_driver', href: 'https://github.com/virensompura/vl53l0x_driver', note: 'GitHub' },
      { label: 'ros2_icm20948', href: 'https://github.com/virensompura/ros2_icm20948', note: 'GitHub' },
      { label: 'Project files', href: 'https://drive.google.com/drive/folders/1-N_lamHz9trtk43rRTvo55dQXPBXFD0H?usp=sharing', note: 'Google Drive' },
    ],
  },
  {
    id: 'humanoid-greeter',
    title: 'Humanoid Greeter Robot',
    short: 'Companion humanoid built alongside Curio that senses crowd movement and greets and talks to museum visitors.',
    domain: 'Human–Robot Interaction',
    categories: ['hardware'],
    status: 'Completed',
    context: 'Vama Communications Pvt. Ltd. — Kolkata Museum',
    role: null,
    tech: ['Sensors', 'Speech', 'Human–robot interaction'],
    cover: img('humanoid-1.webp', 720, 1280, 'Humanoid greeter robot at the museum', '50% 30%'),
    video: { src: 'assets/videos/humanoid-robot-landscape.mp4', poster: 'assets/img/posters/humanoid-greeter.webp', w: 1280, h: 720 },
    overview: 'Developed together with Curio, the humanoid greets and talks to museum visitors, using sensors to detect crowd movement.',
    objective: 'Welcome and engage visitors as they move through the museum.',
    contributions: ['Developed the humanoid robot alongside Curio.', 'Integrated sensors that detect crowd movement to trigger greetings.'],
    problem: null,
    architecture: [],
    hardware: [],
    software: [],
    challenges: [],
    results: [],
    gallery: [
      img('humanoid-1.webp', 720, 1280, 'Humanoid greeter robot'),
      img('humanoid-2.webp', 720, 1280, 'Humanoid greeter robot interacting with visitors'),
    ],
    resources: [
      { label: 'Project files', href: 'https://drive.google.com/drive/folders/1bC7ev7NMXQ1dkGp74KphR3cCT3R6wxd7?usp=sharing', note: 'Google Drive' },
    ],
  },
  {
    id: 'cocoon-sorting',
    title: 'Automatic Cocoon Sorting Machine',
    short: 'Low-cost prototype that sorts male and female silkworm cocoons by weight at 600 cocoons per hour.',
    domain: 'Hardware & Automation',
    categories: ['hardware', 'embedded'],
    status: 'Completed',
    context: null,
    role: null,
    tech: ['Arduino', 'Weight sensing', 'Mechanical design', 'Automation'],
    cover: img('cocoon-1.webp', 720, 1280, 'Automatic cocoon sorting machine prototype', '50% 50%'),
    video: { src: 'assets/videos/cocoon.mp4', poster: 'assets/img/posters/cocoon-sorting.webp', w: 1136, h: 640 },
    overview: 'A low-cost machine that separates male and female cocoons by weight, aimed at improving efficiency in silk production.',
    objective: 'Automate a manual sorting step in silk production with an affordable machine.',
    contributions: ['Designed and built the sorting prototype.'],
    problem: null,
    architecture: [],
    hardware: [],
    software: [],
    challenges: [],
    results: ['Sorting rate of 600 cocoons per hour.'],
    gallery: [
      img('cocoon-1.webp', 720, 1280, 'Cocoon sorting machine'),
      img('cocoon-2.webp', 720, 1280, 'Cocoon sorting mechanism'),
    ],
    resources: [
      { label: 'automatic_cocoon_sorting', href: 'https://github.com/virensompura/automatic_cocoon_sorting', note: 'GitHub' },
      { label: 'Project files', href: 'https://drive.google.com/drive/folders/1Y7df3zIDsXdp7yoCfvPIMWGKgUo8jSRw?usp=sharing', note: 'Google Drive' },
    ],
  },
  {
    id: 'smart-jacket',
    title: 'Smart Jacket for Visually Impaired People',
    short: 'Wearable assistive device that detects obstacles with ultrasonic sensors and gives distance-based vibration feedback.',
    domain: 'Embedded Systems',
    categories: ['embedded', 'hardware'],
    status: 'Completed',
    context: null,
    role: null,
    tech: ['Arduino Mega', 'Ultrasonic sensors', 'Vibration motors'],
    cover: null, // TODO(owner): add a photograph
    video: null,
    overview: 'A wearable assistive device built on an Arduino Mega that detects obstacles and signals their distance to the wearer through vibration.',
    objective: 'Help visually impaired people sense nearby obstacles.',
    contributions: ['Created the wearable using an Arduino Mega, ultrasonic sensors, and vibration motors.', 'Implemented obstacle detection with distance-based feedback.'],
    problem: null,
    architecture: [
      { name: 'Sensing', items: ['Ultrasonic sensors'] },
      { name: 'Control', items: ['Arduino Mega', 'Obstacle detection & distance mapping'] },
      { name: 'Feedback', items: ['Vibration motors'] },
    ],
    hardware: [
      { group: 'Microcontroller', items: ['Arduino Mega'] },
      { group: 'Sensors', items: ['Ultrasonic sensors'] },
      { group: 'Actuators', items: ['Vibration motors'] },
    ],
    software: [],
    challenges: [],
    results: [],
    gallery: [],
    resources: [],
  },
];

export const featuredProjectIds = ['curio', 'ros2-robot-development', 'amr-lidar', 'ros2-sensor-drivers'];

export const experience = [
  {
    role: 'Robotics Engineer',
    org: 'Kion Group',
    period: 'Sept 2025 — Present',
    location: 'Pune, Maharashtra',
    // TODO(owner): confirm wording; keep employer-confidential details out.
    summary: 'Robotics development for industrial automation systems, implementing ROS 2-based solutions for autonomous material handling and warehouse robotics.',
    points: [],
    tech: ['ROS 2', 'Industrial automation'],
    projects: [],
  },
  {
    role: 'Robotic Engineer',
    org: 'Vama Communications Pvt. Ltd.',
    period: 'Sept 2023 — Sept 2025',
    location: 'Ahmedabad, Gujarat',
    summary: 'Led the development of the Curio museum robot’s hardware and software in the R&D department.',
    points: [
      'Designed and implemented custom PCB solutions for enhanced robot functionality.',
      'Implemented ROS 2-based navigation and SLAM on Jetson Nano, improving robot autonomy by 40%.',
      'Developed software modules that reduced system latency by 25% and increased overall robot efficiency.',
    ],
    tech: ['ROS 2', 'Nav2', 'SLAM', 'Jetson Nano', 'PCB design'],
    projects: ['curio', 'humanoid-greeter'],
  },
  {
    role: 'Intern',
    org: 'Fenwick and Ravi (F.A.R.)',
    period: 'Apr 2023 — Jul 2023',
    location: 'Bangalore, Karnataka',
    summary: 'Warehouse automation software and mobile robotics.',
    points: [
      'Developed software for a radio-shuttle system, improving warehouse automation efficiency by 30%.',
      'Created an autonomous mobile robot using the ROS 2 framework, implementing custom navigation algorithms.',
    ],
    tech: ['ROS 2', 'Warehouse automation'],
    projects: [],
  },
  {
    role: 'Trainee Engineer',
    org: 'Raicam Automotive Private Limited',
    period: 'Sept 2020 — Mar 2021',
    location: 'Sanand, Ahmedabad',
    summary: 'Production of clutch actuation systems.',
    points: [
      'Contributed to production of the Clutch Master Cylinder and Concentric Slave Cylinder.',
      'Implemented process improvements that increased production efficiency by 15%.',
    ],
    tech: ['Manufacturing', 'Process improvement'],
    projects: [],
  },
];

export const education = [
  { degree: 'M.Tech. in Robotics Engineering', org: 'M.S. Ramaiah University of Applied Sciences', period: '2021 — 2023', location: 'Bangalore, Karnataka', detail: 'CGPA 9.0 / 10' },
  { degree: 'B.Tech. in Mechatronics Engineering', org: 'Sal College of Engineering', period: '2016 — 2020', location: 'Ahmedabad, Gujarat', detail: 'CGPA 8.02 / 10' },
];

export const certifications = [
  { title: 'Introduction to Machine Learning', org: 'NPTEL — IIT Madras', period: 'Nov 2022' },
];

export const skills = [
  { group: 'Robotics & Autonomy', items: ['ROS / ROS 2', 'Nav2', 'SLAM (ORB-SLAM3, RTAB-Map)', 'Localization & mapping', 'Autonomous navigation', 'Sensor integration & fusion', 'URDF'] },
  { group: 'Embedded Systems & Control', items: ['C / C++', 'Python', 'micro-ROS', 'FreeRTOS', 'ESP32, NodeMCU, Arduino', 'Motor control & encoders', 'RS-485, I²C'] },
  { group: 'Simulation & Development', items: ['Gazebo', 'RViz', 'NVIDIA Isaac Sim (exploring)', 'Linux', 'Docker', 'Git', 'Flask, Streamlit'] },
  { group: 'Electronics & Hardware', items: ['PCB design', 'Jetson Nano, Raspberry Pi 4', 'Electronics integration', 'SOLIDWORKS, CATIA V5, AutoCAD'] },
];

export const interests = [
  'Complete robot stacks — from motor drivers to navigation goals',
  'Real-time embedded control for mobile robots',
  'Visual and LiDAR SLAM on resource-constrained compute',
  'Simulation and digital twins for faster robot bring-up',
];

// Engineering Lab: experiments and explorations. Status values: 'Exploring' | 'In Progress' | 'Completed'.
// TODO(owner): update statuses — entries default to 'Exploring' because completion is not documented.
export const lab = [
  {
    title: 'NVIDIA Isaac Sim with ROS 2',
    period: 'Jun 2025',
    status: 'Exploring',
    description: 'Evaluating Isaac Sim for robot simulation: URDF import, the ROS 2 bridge, and simulated sensors as a complement to Gazebo.',
    tech: ['Isaac Sim', 'ROS 2', 'URDF'],
    links: [{ label: 'Related note', note: 'isaac-sim' }],
  },
  {
    title: 'Butler Robot — restaurant delivery in simulation',
    period: 'Feb 2025',
    status: 'Exploring',
    description: 'ROS 2 Humble robot that navigates a simulated restaurant, picks up orders from the kitchen, and delivers them to tables using Nav2, AMCL localization, and pre-mapped locations in Gazebo.',
    tech: ['ROS 2 Humble', 'Nav2', 'AMCL', 'Gazebo'],
    links: [{ label: 'Repository', href: 'https://github.com/virensompura/butler_robot' }],
  },
  {
    title: 'micro-ROS on microcontrollers',
    period: '2025',
    status: 'Exploring',
    description: 'Bringing microcontrollers into the ROS 2 graph with micro-ROS, building on the encoder, power-sensing, and stepper firmware from the ROS 2 robot development work.',
    tech: ['micro-ROS', 'ESP32', 'FreeRTOS'],
    links: [{ label: 'Related note', note: 'microros' }, { label: 'Related project', project: 'ros2-robot-development' }],
  },
  {
    title: 'HP60C depth camera ROS 2 workspace',
    period: 'Dec 2024',
    status: 'Exploring',
    description: 'ROS 2 workspace for bringing up the HP60C depth camera.',
    tech: ['ROS 2', 'Depth camera'],
    links: [{ label: 'Repository', href: 'https://github.com/virensompura/ascam_ros2_ws' }],
  },
];

// Notes: article bodies live in content/notes/<slug>.html. Reading time is computed at build.
export const noteCategories = { ros2: 'ROS 2', navigation: 'Autonomous Navigation', slam: 'SLAM', simulation: 'Simulation', embedded: 'Embedded Systems' };

export const notes = [
  { slug: 'microros', title: 'micro-ROS: Bringing ROS 2 to Microcontrollers', category: 'embedded', date: '2025-08', summary: 'Deploy micro-ROS on STM32 and ESP32 to publish sensor data and subscribe to control commands directly within the ROS 2 ecosystem.' },
  { slug: 'slam-deep', title: 'SLAM Demystified: From Theory to ROS 2 Implementation', category: 'slam', date: '2025-07', summary: 'The math and algorithms behind Simultaneous Localization and Mapping, and how to run ORB-SLAM3 and RTAB-Map with Nav2.' },
  { slug: 'isaac-sim', title: 'NVIDIA Isaac Sim: Photorealistic Robot Simulation with ROS 2', category: 'simulation', date: '2025-06', summary: 'Set up Isaac Sim, import a URDF, and stream sensor data to ROS 2 for sensor development and policy training.' },
  { slug: 'nav2', title: 'Nav2 Stack Deep Dive: Autonomous Navigation from Scratch', category: 'navigation', date: '2025-05', summary: 'Set up Nav2 for a custom robot, configure costmaps, and send navigation goals programmatically.' },
  { slug: 'nodes-topics', title: 'ROS 2 Architecture: Nodes, Topics, Services & Actions Explained', category: 'ros2', date: '2025-04', summary: 'The core communication primitives of ROS 2 and how they map to real robot behaviours, with practical examples.' },
  { slug: 'ros2-install', title: 'Getting Started with ROS 2: Installation & Workspace Setup', category: 'ros2', date: '2025-03', summary: 'Install ROS 2 Humble on Ubuntu 22.04, configure your environment, and build your first workspace.' },
];

export const approach = [
  { name: 'Sense', body: 'Choosing and integrating the sensors a robot depends on, and getting clean, timed data out of them.', examples: 'LiDAR, IMU, time-of-flight, wheel encoders, power sensing' },
  { name: 'Perceive', body: 'Turning raw measurements into an understanding of where the robot is and what surrounds it.', examples: 'ORB-SLAM3, RTAB-Map, localization, sensor fusion' },
  { name: 'Decide', body: 'Planning paths and behaviours that are safe, efficient, and appropriate for the environment.', examples: 'Nav2, A* search, docking with NavigateToPose' },
  { name: 'Act', body: 'Executing decisions through deterministic embedded control and reliable motor communication.', examples: 'micro-ROS, FreeRTOS, RS-485 motor drivers, custom PCBs' },
];
