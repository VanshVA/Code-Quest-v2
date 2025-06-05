import React, { useRef, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome,
  BookmarkBorder,
  Bookmark,
  ContentCopy,
  FilterList,
  GitHub,
  KeyboardArrowDown,
  KeyboardArrowRight,
  Language,
  Link as LinkIcon,
  LocalLibrary,
  MenuBook,
  School,
  Search,
  Share,
  Star,
  StarOutline,
  YouTube,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Current date and user info
const CURRENT_DATE_TIME = "2025-06-04 23:22:06";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

// Sample references data
const references = [
  {
    id: 1,
    title: "Algorithms and Data Structures",
    resources: [
      {
        title: "Introduction to Algorithms",
        authors: ["Thomas H. Cormen", "Charles E. Leiserson", "Ronald L. Rivest", "Clifford Stein"],
        description: "The fundamental algorithm reference and textbook for computer science. Covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.",
        publisher: "MIT Press",
        year: 2022,
        type: "book",
        link: "https://mitpress.mit.edu/books/introduction-algorithms-third-edition",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
        rating: 4.8,
        tags: ["algorithms", "textbook", "essential", "computer science"],
        bookmarked: true
      },
      {
        title: "Algorithm Design Manual",
        authors: ["Steven S. Skiena"],
        description: "This renowned text addresses the application of algorithm theory to real-world problems. It includes practical advice on implementation and performance considerations.",
        publisher: "Springer",
        year: 2020,
        type: "book",
        link: "https://www.springer.com/gp/book/9783030542559",
        image: "https://images.unsplash.com/photo-1532153955177-f59af40d6472",
        rating: 4.7,
        tags: ["algorithms", "problem-solving", "interviews"],
        bookmarked: false
      },
      {
        title: "Visualizing Algorithms",
        authors: ["Mike Bostock"],
        description: "An interactive essay explaining various algorithms through engaging visualizations. Helps build intuition for how complex algorithms function.",
        publisher: "Self-published",
        year: 2024,
        type: "article",
        link: "https://bost.ocks.org/mike/algorithms/",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        rating: 4.9,
        tags: ["visualization", "interactive", "learning"],
        bookmarked: true
      },
      {
        title: "Advanced Data Structures",
        authors: ["Peter Brass"],
        description: "Comprehensive coverage of advanced data structures with detailed implementation considerations and performance analyses.",
        publisher: "Cambridge University Press",
        year: 2023,
        type: "book",
        link: "https://www.cambridge.org/core/books/advanced-data-structures/",
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
        rating: 4.6,
        tags: ["data structures", "advanced", "performance"],
        bookmarked: false
      },
      {
        title: "Algorithms in a Nutshell",
        authors: ["George T. Heineman", "Gary Pollice", "Stanley Selkow"],
        description: "A practical guide focusing on algorithm implementation with code examples in Python, C++, and Java.",
        publisher: "O'Reilly Media",
        year: 2021,
        type: "book",
        link: "https://www.oreilly.com/library/view/algorithms-in-a/9780596516246/",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
        rating: 4.4,
        tags: ["algorithms", "practical", "implementation", "multiple languages"],
        bookmarked: false
      }
    ]
  },
  {
    id: 2,
    title: "Web Development",
    resources: [
      {
        title: "Modern Frontend Architecture",
        authors: ["Sarah Johnson"],
        description: "An in-depth exploration of modern frontend architecture patterns, component design, and state management across popular frameworks.",
        publisher: "Frontend Masters Press",
        year: 2025,
        type: "article",
        link: "https://frontendmasters.com/articles/modern-frontend-architecture/",
        image: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8",
        rating: 4.9,
        tags: ["frontend", "architecture", "react", "vue", "angular"],
        bookmarked: true
      },
      {
        title: "Full Stack Development with Node.js and React",
        authors: ["David Miller", "Jennifer Chen"],
        description: "Comprehensive guide to building scalable web applications using Node.js backend and React frontend with practical examples.",
        publisher: "Apress",
        year: 2024,
        type: "book",
        link: "https://www.apress.com/books/fullstack-nodejs-react",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        rating: 4.7,
        tags: ["fullstack", "node.js", "react", "javascript"],
        bookmarked: false
      },
      {
        title: "Mastering CSS Grid Layout",
        authors: ["Lea Verou"],
        description: "Advanced techniques and best practices for CSS Grid layouts with interactive examples and browser compatibility guides.",
        publisher: "CSS Tricks",
        year: 2023,
        type: "tutorial",
        link: "https://css-tricks.com/mastering-css-grid",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
        rating: 4.8,
        tags: ["css", "layout", "responsive", "design"],
        bookmarked: false
      },
      {
        title: "Progressive Web Apps: From Theory to Practice",
        authors: ["Alex Russell", "Frances Berriman"],
        description: "Definitive guide to building progressive web apps that work offline, load quickly, and provide app-like experiences.",
        publisher: "O'Reilly Media",
        year: 2023,
        type: "book",
        link: "https://www.oreilly.com/library/progressive-web-apps",
        image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2",
        rating: 4.6,
        tags: ["pwa", "service workers", "offline", "performance"],
        bookmarked: true
      },
      {
        title: "GraphQL API Design Patterns",
        authors: ["Eve Porcello", "Alex Banks"],
        description: "Best practices for designing, implementing, and scaling GraphQL APIs with real-world examples and case studies.",
        publisher: "Manning Publications",
        year: 2024,
        type: "book",
        link: "https://www.manning.com/books/graphql-api-design",
        image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498",
        rating: 4.5,
        tags: ["graphql", "api", "backend", "schema design"],
        bookmarked: false
      }
    ]
  },
  {
    id: 3,
    title: "Machine Learning & AI",
    resources: [
      {
        title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
        authors: ["Aurélien Géron"],
        description: "Practical guide to implementing machine learning algorithms with Python libraries, from basic concepts to deep learning.",
        publisher: "O'Reilly Media",
        year: 2024,
        type: "book",
        link: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
        rating: 4.9,
        tags: ["machine learning", "python", "tensorflow", "keras"],
        bookmarked: true
      },
      {
        title: "Deep Learning for Computer Vision",
        authors: ["Fei-Fei Li", "Justin Johnson", "Serena Yeung"],
        description: "Stanford's comprehensive course on deep learning methods for visual recognition tasks with practical implementations.",
        publisher: "Stanford University",
        year: 2025,
        type: "course",
        link: "https://cs231n.stanford.edu/",
        image: "https://images.unsplash.com/photo-1597589827317-4c6d6e0a90f1",
        rating: 4.8,
        tags: ["deep learning", "computer vision", "cnn", "image recognition"],
        bookmarked: false
      },
      {
        title: "Reinforcement Learning: An Introduction",
        authors: ["Richard S. Sutton", "Andrew G. Barto"],
        description: "The classic textbook on reinforcement learning, covering theoretical foundations and practical algorithms.",
        publisher: "MIT Press",
        year: 2022,
        type: "book",
        link: "https://mitpress.mit.edu/books/reinforcement-learning-second-edition",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        rating: 4.7,
        tags: ["reinforcement learning", "ai", "mdp", "q-learning"],
        bookmarked: false
      },
      {
        title: "Natural Language Processing with Transformers",
        authors: ["Lewis Tunstall", "Leandro von Werra", "Thomas Wolf"],
        description: "Comprehensive guide to transformer models that have revolutionized NLP, including BERT, GPT, and their applications.",
        publisher: "O'Reilly Media",
        year: 2023,
        type: "book",
        link: "https://www.oreilly.com/library/view/natural-language-processing/9781098136789/",
        image: "https://images.unsplash.com/photo-1546652292-c30a89923526",
        rating: 4.8,
        tags: ["nlp", "transformers", "bert", "gpt"],
        bookmarked: true
      },
      {
        title: "Machine Learning for Algorithmic Trading",
        authors: ["Stefan Jansen"],
        description: "Strategies and techniques for applying machine learning to financial markets and algorithmic trading systems.",
        publisher: "Packt Publishing",
        year: 2024,
        type: "book",
        link: "https://www.packtpub.com/product/machine-learning-for-algorithmic-trading-second-edition/9781839217715",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
        rating: 4.6,
        tags: ["machine learning", "finance", "trading", "time series"],
        bookmarked: false
      }
    ]
  },
  {
    id: 4,
    title: "System Design & Architecture",
    resources: [
      {
        title: "System Design Interview: An Insider's Guide",
        authors: ["Alex Xu"],
        description: "Practical guide to tackling system design interview questions with detailed examples and methodologies.",
        publisher: "ByteByteGo",
        year: 2023,
        type: "book",
        link: "https://www.bytebytego.com/",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        rating: 4.8,
        tags: ["system design", "interviews", "architecture", "scalability"],
        bookmarked: true
      },
      {
        title: "Designing Data-Intensive Applications",
        authors: ["Martin Kleppmann"],
        description: "Deep dive into the principles of data systems and how they affect application architecture and design.",
        publisher: "O'Reilly Media",
        year: 2022,
        type: "book",
        link: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
        image: "https://images.unsplash.com/photo-1454165205744-3b78555e5572",
        rating: 5.0,
        tags: ["data systems", "distributed systems", "databases", "essential"],
        bookmarked: true
      },
      {
        title: "Microservices Patterns",
        authors: ["Chris Richardson"],
        description: "Comprehensive guide to designing, implementing, and deploying microservices with practical patterns and anti-patterns.",
        publisher: "Manning Publications",
        year: 2023,
        type: "book",
        link: "https://www.manning.com/books/microservices-patterns",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        rating: 4.7,
        tags: ["microservices", "architecture", "patterns", "distributed systems"],
        bookmarked: false
      },
      {
        title: "The Architecture of Open Source Applications",
        authors: ["Amy Brown", "Greg Wilson"],
        description: "Collection of essays examining the architecture and design decisions behind major open source applications.",
        publisher: "aosabook.org",
        year: 2021,
        type: "article",
        link: "http://aosabook.org/en/index.html",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        rating: 4.6,
        tags: ["open source", "architecture", "case studies"],
        bookmarked: false
      },
      {
        title: "Building Event-Driven Microservices",
        authors: ["Adam Bellemare"],
        description: "Modern approaches to building scalable event-driven systems with microservices architecture.",
        publisher: "O'Reilly Media",
        year: 2024,
        type: "book",
        link: "https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
        rating: 4.5,
        tags: ["event-driven", "microservices", "kafka", "messaging"],
        bookmarked: false
      }
    ]
  },
  {
    id: 5,
    title: "Coding Interviews",
    resources: [
      {
        title: "Cracking the Coding Interview",
        authors: ["Gayle Laakmann McDowell"],
        description: "The most popular guide to preparing for coding interviews with 189 programming questions and solutions.",
        publisher: "CareerCup",
        year: 2022,
        type: "book",
        link: "http://www.crackingthecodinginterview.com/",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        rating: 4.9,
        tags: ["interviews", "algorithms", "data structures", "problem-solving"],
        bookmarked: true
      },
      {
        title: "Grokking the System Design Interview",
        authors: ["Design Gurus Team"],
        description: "Comprehensive course on preparing for system design interviews with step-by-step approaches to common problems.",
        publisher: "Design Gurus",
        year: 2024,
        type: "course",
        link: "https://designgurus.org/course/grokking-the-system-design-interview",
        image: "https://images.unsplash.com/photo-1561485132-59468cd0b553",
        rating: 4.8,
        tags: ["system design", "interviews", "architecture", "scalability"],
        bookmarked: false
      },
      {
        title: "Elements of Programming Interviews",
        authors: ["Adnan Aziz", "Tsung-Hsien Lee", "Amit Prakash"],
        description: "Comprehensive collection of coding problems with detailed explanations and solutions in C++, Java, and Python.",
        publisher: "EPI Press",
        year: 2023,
        type: "book",
        link: "https://elementsofprogramminginterviews.com/",
        image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3",
        rating: 4.7,
        tags: ["interviews", "algorithms", "data structures", "problem-solving"],
        bookmarked: false
      },
      {
        title: "Tech Interview Handbook",
        authors: ["Yangshun Tay"],
        description: "Free online resource with comprehensive guides to technical interview preparation, algorithms, and system design.",
        publisher: "GitHub",
        year: 2025,
        type: "article",
        link: "https://techinterviewhandbook.org/",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        rating: 4.9,
        tags: ["interviews", "algorithms", "system design", "behavioral"],
        bookmarked: true
      },
      {
        title: "LeetCode Patterns",
        authors: ["Sean Prashad"],
        description: "Curated list of LeetCode problems organized by patterns to efficiently master algorithmic patterns.",
        publisher: "GitHub",
        year: 2024,
        type: "article",
        link: "https://seanprashad.com/leetcode-patterns/",
        image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea",
        rating: 4.8,
        tags: ["leetcode", "algorithms", "patterns", "interviews"],
        bookmarked: false
      }
    ]
  }
];

// Sample code snippets
const codeSnippets = {
  dijkstra: `
function dijkstra(graph, start) {
  // Initialize distances and visited array
  const distances = {};
  const visited = {};
  const nodes = Object.keys(graph);
  
  // Set initial distances to Infinity
  for (let node of nodes) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  
  while (true) {
    // Find the node with the minimum distance
    let minNode = null;
    let minDistance = Infinity;
    
    for (let node of nodes) {
      if (!visited[node] && distances[node] < minDistance) {
        minNode = node;
        minDistance = distances[node];
      }
    }
    
    // If no unvisited nodes remain or we've reached the end
    if (minNode === null) break;
    
    // Mark the node as visited
    visited[minNode] = true;
    
    // Update distances to neighboring nodes
    for (let neighbor in graph[minNode]) {
      const distance = graph[minNode][neighbor] + distances[minNode];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
      }
    }
  }
  
  return distances;
}`,
  react: `
import React, { useState, useEffect } from 'react';

// Custom hook for data fetching with loading and error states
function useDataFetcher(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(\`HTTP error: \${response.status}\`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Example component using the custom hook
function DataDisplay({ endpoint }) {
  const { data, loading, error } = useDataFetcher(endpoint);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Data Retrieved</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}`,
  tensorflow: `
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Conv2D, MaxPooling2D, Flatten

# Load and preprocess data
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train = x_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
x_test = x_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0
y_train = tf.keras.utils.to_categorical(y_train, 10)
y_test = tf.keras.utils.to_categorical(y_test, 10)

# Build CNN model
model = Sequential([
    Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D(pool_size=(2, 2)),
    Conv2D(64, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(10, activation='softmax')
])

# Compile model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train model
model.fit(
    x_train, y_train,
    batch_size=128,
    epochs=10,
    validation_split=0.1
)

# Evaluate on test data
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test accuracy: {test_acc:.4f}")
`,
  microservices: `
// Example API Gateway Service in Node.js
const express = require('express');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for request logging
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Service discovery - could be replaced with Consul/etcd in production
const services = {
  users: 'http://user-service:8080',
  products: 'http://product-service:8081',
  orders: 'http://order-service:8082'
};

// Route different API endpoints to appropriate microservices
app.use('/api/users', authenticateToken, createProxyMiddleware({ 
  target: services.users,
  changeOrigin: true,
  pathRewrite: {'^/api/users': '/'}
}));

app.use('/api/products', createProxyMiddleware({ 
  target: services.products,
  changeOrigin: true,
  pathRewrite: {'^/api/products': '/'}
}));

app.use('/api/orders', authenticateToken, createProxyMiddleware({ 
  target: services.orders,
  changeOrigin: true,
  pathRewrite: {'^/api/orders': '/'}
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(\`API Gateway running on port \${port}\`);
});
`,
};

const ReferencesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State
  const [activeCategory, setActiveCategory] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [codeCopied, setCodeCopied] = useState({});
  
  // Handle copy code
  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCodeCopied({ ...codeCopied, [id]: true });
    
    setTimeout(() => {
      setCodeCopied({ ...codeCopied, [id]: false });
    }, 2000);
  };
  
  // Filter resources based on search term, type, and bookmarks
  const getFilteredResources = () => {
    const category = references.find(cat => cat.id === activeCategory) || references[0];
    
    return category.resources.filter(resource => {
      const matchesSearch = searchTerm === '' || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesType = filterType === 'all' || resource.type === filterType;
      const matchesBookmark = !bookmarkedOnly || resource.bookmarked;
      
      return matchesSearch && matchesType && matchesBookmark;
    });
  };
  
  // Canvas animation for background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 2;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Premium gradient orbs class with improved rendering
    class GradientOrb {
      constructor() {
        this.reset();
      }
      
      reset() {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (isMobile ? 100 : 180) + (isMobile ? 30 : 50);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.12 + 0.04;
        
        // Premium color combinations
        const colorSets = [
          { start: '#bc4037', end: '#f47061' }, // Primary red
          { start: '#9a342d', end: '#bd5c55' }, // Dark red
          { start: '#2C3E50', end: '#4A6572' }, // Dark blue
          { start: '#3a47d5', end: '#00d2ff' }, // Blue
        ];
        
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        // Bounce effect at edges
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }
      
      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        const startColor = this.hexToRgba(this.colors.start, this.opacity);
        const endColor = this.hexToRgba(this.colors.end, 0);
        
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    
    // Create optimal number of orbs based on screen size
    const orbCount = isMobile ? 6 : 10;
    const orbs = Array(orbCount).fill().map(() => new GradientOrb());
    
    // Animation loop with performance optimization
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      orbs.forEach((orb) => {
        orb.update();
        orb.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isMobile, isDark]);

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'book':
        return <MenuBook />;
      case 'article':
        return <Language />;
      case 'course':
        return <School />;
      case 'tutorial':
        return <YouTube />;
      default:
        return <LinkIcon />;
    }
  };
  
  const filteredResources = getFilteredResources();
  
  return (
    <>
      {/* Canvas Background for Premium Gradient Animation */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}>
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        {/* Overlay for better text contrast */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: isDark ? 'rgba(30, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(30px)',
          }} 
        />
      </Box>

      {/* Hero Section */}
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          pt: { xs: '100px', sm: '120px', md: '120px' },
          pb: { xs: '60px', sm: '80px', md: '60px' },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg"> 
          <Grid 
            container 
            spacing={{ xs: 4, md: 8 }}
            alignItems="center" 
            justifyContent="center"
          >
            <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 3, display: 'inline-block' }}
              >
                <Chip 
                  label="LEARNING RESOURCES" 
                  color="primary"
                  size="small"
                  icon={<AutoAwesome sx={{ color: 'white !important', fontSize: '0.85rem', }} />}
                  sx={{ 
                    background: theme.palette.gradients.primary,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    letterSpacing: 1.2,
                    py: 2.2,
                    pl: 1,
                    pr: 2,
                    borderRadius: '100px',
                    boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                    '& .MuiChip-icon': { 
                      color: 'white',
                      mr: 0.5
                    }
                  }}
                />
              </MotionBox> 
              
              <MotionBox>
                {/* Page Title */}
                <MotionTypography
                  variant="h1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.8rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: { xs: 3, md: 4 },
                    letterSpacing: '-0.02em',
                  }}
                >
                  Code Quest
                  <Box 
                    component="span" 
                    sx={{
                      display: 'block',
                      background: theme.palette.gradients.primary,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textFillColor: 'transparent',
                    }}
                  >
                    Learning References
                  </Box>
                </MotionTypography>
                
                {/* Subheadline */}
                <MotionTypography
                  variant="h5"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  color="textSecondary"
                  sx={{ 
                    mb: 5,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    maxWidth: '800px',
                    mx: 'auto',
                  }}
                >
                  Curated collection of top books, articles, courses, and resources to enhance your programming skills
                </MotionTypography>
              </MotionBox>
              
              {/* Search Bar */}
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  pl: 2,
                  maxWidth: '600px',
                  mx: 'auto',
                  borderRadius: '100px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <Search sx={{ color: 'text.secondary', mr: 1 }} />
                <Box
                  component="input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search references, authors, topics..."
                  sx={{
                    border: 'none',
                    background: 'transparent',
                    flexGrow: 1,
                    fontSize: '1rem',
                    py: 1,
                    outline: 'none',
                    color: 'text.primary',
                    '&::placeholder': {
                      color: 'text.secondary',
                      opacity: 0.7,
                    },
                    fontFamily: theme.typography.fontFamily,
                  }}
                />
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Main Content Section */}
      <Box component="section" sx={{ pb: 10 }}>
        <Container maxWidth="lg">
          {/* Category Tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={activeCategory} 
              onChange={(_, value) => setActiveCategory(value)}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              allowScrollButtonsMobile
              TabIndicatorProps={{
                sx: {
                  height: 4,
                  borderRadius: '2px',
                }
              }}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minWidth: 100,
                  px: 3,
                },
              }}
            >
              {references.map((category) => (
                <Tab 
                  key={category.id} 
                  value={category.id} 
                  label={category.title}
                />
              ))}
            </Tabs>
          </Box>
          
          {/* Filters Row */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button 
                variant={filterType === 'all' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setFilterType('all')}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                }}
              >
                All
              </Button>
              
              <Button 
                variant={filterType === 'book' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setFilterType('book')}
                startIcon={<MenuBook fontSize="small" />}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                }}
              >
                Books
              </Button>
              
              <Button 
                variant={filterType === 'article' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setFilterType('article')}
                startIcon={<Language fontSize="small" />}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                }}
              >
                Articles
              </Button>
              
              <Button 
                variant={filterType === 'course' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setFilterType('course')}
                startIcon={<School fontSize="small" />}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                }}
              >
                Courses
              </Button>
              
              <Button 
                variant={filterType === 'tutorial' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setFilterType('tutorial')}
                startIcon={<YouTube fontSize="small" />}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                }}
              >
                Tutorials
              </Button>
            </Stack>
            
            {/* Bookmark Filter */}
            <Button
              variant={bookmarkedOnly ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              startIcon={bookmarkedOnly ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
              }}
            >
              {bookmarkedOnly ? 'Bookmarked' : 'All Items'}
            </Button>
          </Box>
          
          {/* Results Count */}
          <Typography 
            variant="body2" 
            color="textSecondary" 
            sx={{ mb: 3 }}
          >
            Showing {filteredResources.length} resources
            {searchTerm && ` matching "${searchTerm}"`}
            {filterType !== 'all' && ` in ${filterType}s`}
            {bookmarkedOnly && ' from your bookmarks'}
          </Typography>
          
          {/* Resources Grid */}
          <Grid container spacing={3}>
            {filteredResources.length === 0 ? (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No matching resources found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try adjusting your search or filters to see more results
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              filteredResources.map((resource, index) => (
                <Grid item xs={12} md={6} lg={4} key={`${activeCategory}-${index}`}>
                  <MotionCard
                    whileHover={{ 
                      y: -8,
                      boxShadow: isDark 
                        ? '0 14px 28px rgba(0,0,0,0.4)' 
                        : '0 14px 28px rgba(0,0,0,0.15)'
                    }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: isDark 
                        ? '0 8px 16px rgba(0,0,0,0.3)' 
                        : '0 8px 16px rgba(0,0,0,0.08)',
                      backgroundColor: isDark 
                        ? 'rgba(30, 28, 28, 0.7)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    }}
                  >
                    {/* Resource Image */}
                    <Box sx={{ position: 'relative', pt: '56.25%' }}>
                      <Box
                        component="img"
                        src={resource.image}
                        alt={resource.title}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      
                      {/* Type Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          borderRadius: '20px',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {getTypeIcon(resource.type)}
                        <Typography 
                          variant="caption" 
                          component="span" 
                          sx={{ 
                            ml: 0.5,
                            textTransform: 'capitalize',
                          }}
                        >
                          {resource.type}
                        </Typography>
                      </Box>
                      
                      {/* Rating Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          borderRadius: '20px',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <Star 
                          sx={{ 
                            fontSize: '0.85rem',
                            color: '#FFD700',
                            mr: 0.5
                          }} 
                        />
                        {resource.rating}
                      </Box>
                      
                      {/* Bookmark Button */}
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.8)',
                          }
                        }}
                      >
                        {resource.bookmarked ? 
                          <Bookmark sx={{ color: '#FFD700' }} /> : 
                          <BookmarkBorder />
                        }
                      </IconButton>
                    </Box>
                    
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Title & Year */}
                      <Box sx={{ mb: 1 }}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {resource.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            {resource.year}
                          </Typography>
                          
                          <Typography variant="body2" color="textSecondary">
                            {resource.publisher}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Authors */}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2,
                          fontStyle: 'italic', 
                        }}
                      >
                        {resource.authors.join(', ')}
                      </Typography>
                      
                      {/* Description */}
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                          mb: 3,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {resource.description}
                      </Typography>
                      
                      <Box sx={{ flexGrow: 1 }} />
                      
                      {/* Tags */}
                      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {resource.tags.map((tag, i) => (
                          <Chip
                            key={i}
                            label={tag}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              height: '22px',
                              bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                            }}
                          />
                        ))}
                      </Box>
                      
                      {/* Action Button */}
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        endIcon={<KeyboardArrowRight />}
                        component="a"
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          borderWidth: '2px',
                          '&:hover': {
                            borderWidth: '2px',
                          }
                        }}
                      >
                        View Resource
                      </Button>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>
      
      {/* Code Snippets Section */}
      <Box component="section" sx={{ pb: 10 }}>
        <Container maxWidth="lg">
          <MotionTypography
            variant="h4"
            component="h2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            sx={{ 
              fontWeight: 700, 
              mb: 4, 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LocalLibrary sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />
            Code Reference Examples
          </MotionTypography>
          
          <Grid container spacing={4}>
            {/* Dijkstra's Algorithm */}
            <Grid item xs={12} md={6}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Dijkstra's Shortest Path Algorithm
                  </Typography>
                  
                  <IconButton 
                    size="small"
                    onClick={() => handleCopyCode(codeSnippets.dijkstra, 'dijkstra')}
                    color={codeCopied.dijkstra ? 'success' : 'default'}
                    sx={{
                      bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
                
                <SyntaxHighlighter
                  language="javascript"
                  style={isDark ? vscDarkPlus : prism}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    fontSize: '0.9rem',
                    maxHeight: '400px',
                  }}
                >
                  {codeSnippets.dijkstra}
                </SyntaxHighlighter>
              </MotionPaper>
            </Grid>
            
            {/* React Custom Hook */}
            <Grid item xs={12} md={6}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    React Custom Data Fetching Hook
                  </Typography>
                  
                  <IconButton 
                    size="small"
                    onClick={() => handleCopyCode(codeSnippets.react, 'react')}
                    color={codeCopied.react ? 'success' : 'default'}
                    sx={{
                      bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
                
                <SyntaxHighlighter
                  language="jsx"
                  style={isDark ? vscDarkPlus : prism}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    fontSize: '0.9rem',
                    maxHeight: '400px',
                  }}
                >
                  {codeSnippets.react}
                </SyntaxHighlighter>
              </MotionPaper>
            </Grid>
            
            {/* TensorFlow CNN */}
            <Grid item xs={12} md={6}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    TensorFlow CNN Implementation
                  </Typography>
                  
                  <IconButton 
                    size="small"
                    onClick={() => handleCopyCode(codeSnippets.tensorflow, 'tensorflow')}
                    color={codeCopied.tensorflow ? 'success' : 'default'}
                    sx={{
                      bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
                
                <SyntaxHighlighter
                  language="python"
                  style={isDark ? vscDarkPlus : prism}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    fontSize: '0.9rem',
                    maxHeight: '400px',
                  }}
                >
                  {codeSnippets.tensorflow}
                </SyntaxHighlighter>
              </MotionPaper>
            </Grid>
            
            {/* Microservices API Gateway */}
            <Grid item xs={12} md={6}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Microservices API Gateway
                  </Typography>
                  
                  <IconButton 
                    size="small"
                    onClick={() => handleCopyCode(codeSnippets.microservices, 'microservices')}
                    color={codeCopied.microservices ? 'success' : 'default'}
                    sx={{
                      bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
                
                <SyntaxHighlighter
                  language="javascript"
                  style={isDark ? vscDarkPlus : prism}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    fontSize: '0.9rem',
                    maxHeight: '400px',
                  }}
                >
                  {codeSnippets.microservices}
                </SyntaxHighlighter>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* GitHub Resources */}
      <Box component="section" sx={{ pb: 10 }}>
        <Container maxWidth="lg">
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: isDark 
                ? '0 20px 60px rgba(0, 0, 0, 0.4)' 
                : '0 20px 60px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Background Image & Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(https://images.unsplash.com/photo-1618401471353-b98afee0b2eb)',
                backgroundSize: 'cover',
                backgroundPosition: "center",
                filter: 'blur(10px)',
                zIndex: -1,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isDark ? 'rgba(30, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
              }}
            />
            <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <MotionTypography
                variant="h4"
                component="h2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  fontWeight: 700, 
                  mb: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <GitHub sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />
                GitHub Resources
              </MotionTypography>
              
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Explore our curated list of GitHub repositories and resources to enhance your coding skills and projects.
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                href=""
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderRadius: '100px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                  }
                }}
                >
                Explore on GitHub
                </Button>
            </Box>
            </MotionPaper>
            </Container>
            </Box>
    </>
    )
    }
export default ReferencesPage