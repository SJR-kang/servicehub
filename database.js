    // ============================================
    // 🗄️ SERVICEHUB UNIFIED DATABASE
    // ============================================

    const ServiceHubDB = {
        // Storage
        _providers: [],
        _requests: [],
        _users: [],
        _soldProducts: [],
        _storageKey: 'servicehub_db_data',
        _soldKey: 'sold_products',
        
        // Initialize database
        init: async function() {
            console.log('🔄 Initializing ServiceHub Unified Database...');
            
            const saved = this.loadFromStorage();
            
            if (saved && saved.providers && saved.providers.length > 0) {
                this._providers = saved.providers;
                this._requests = saved.requests || [];
                this._users = saved.users || [];
                console.log('✅ Loaded from localStorage:', this._providers.length, 'providers');
            } else {
                this.loadBuiltInData();
            }
            
            // Load sold products
            this.loadSoldProducts();
            
            console.log('📊 Final Provider Count:', this._providers.length);
            return true;
        },
        
        loadBuiltInData: function() {
            // ============================================
            // COMPLETE PROVIDERS WITH ALL DETAILS
            // ============================================
            this._providers = [
                { 
                    id: 1, 
                    name: "Dr. Sarah Mitchell", 
                    email: "sarah@servicehub.com",
                    password: "password123",
                    service: "Academic Proofreading & Editing", 
                    category: "Academic", 
                    price: "$25/page", 
                    rating: 4.9,
                    availability: "Mon–Fri, 9AM–8PM",
                    description: "PhD in English Literature with 8+ years experience. Specializes in thesis, dissertations, and ESL academic writing.",
                    fullDetail: "Holds current university editing certificate from UChicago. Completed 500+ papers with 0 plagiarism issues.",
                    location: "New York, NY",
                    languages: ["English", "Spanish"],
                    yearsExperience: 8,
                    contactEmail: "sarah.mitchell@servicehub.com",
                    contactPhone: "+1 (555) 234-5678",
                    avatarImg: "https://randomuser.me/api/portraits/women/68.jpg",
                    evidenceImg: "https://picsum.photos/id/104/1200/400",
                    verificationStatus: {
                        idVerified: true,
                        emailVerified: true,
                        paymentVerified: true,
                        backgroundChecked: true
                    },
                    credentials: [
                        "PhD in English Literature - Columbia University",
                        "Certified Professional Editor - ACES",
                        "Published Author - 3 Academic Papers"
                    ],
                    servicesOffered: [
                        { name: "Proofreading", price: "$20/page", description: "Grammar, spelling, punctuation check" },
                        { name: "Editing", price: "$35/page", description: "Structural and content editing" }
                    ],
                    reviews: [
                        { reviewer: "John D.", rating: 5, text: "Dr. Mitchell saved my thesis! Incredible attention to detail." },
                        { reviewer: "Emily R.", rating: 5, text: "Highly recommend! Very professional and thorough." }
                    ]
                },
                { 
                    id: 2, 
                    name: "Elite Clean Solutions", 
                    email: "elite@servicehub.com",
                    password: "password123",
                    service: "Professional Deep Cleaning", 
                    category: "Cleaning", 
                    price: "$120-250/session", 
                    rating: 4.8,
                    availability: "Daily 7AM–9PM",
                    description: "Certified residential and commercial cleaning with 7 years experience.",
                    fullDetail: "Licensed and insured. EPA-registered disinfectants. Satisfaction guaranteed.",
                    location: "Los Angeles, CA",
                    languages: ["English", "Spanish"],
                    yearsExperience: 7,
                    contactEmail: "eliteclean@servicehub.com",
                    contactPhone: "+1 (555) 345-6789",
                    avatarImg: "https://randomuser.me/api/portraits/men/32.jpg",
                    evidenceImg: "https://picsum.photos/id/0/1200/400",
                    verificationStatus: {
                        idVerified: true,
                        emailVerified: true,
                        paymentVerified: true,
                        backgroundChecked: true
                    },
                    credentials: [
                        "ISSA Certified Cleaner",
                        "OSHA Safety Certified",
                        "EPA Green Cleaning Certified"
                    ],
                    servicesOffered: [
                        { name: "Deep Cleaning", price: "$150-250", description: "Full home deep clean" },
                        { name: "Move-in/Out Clean", price: "$200-350", description: "Complete property cleaning" }
                    ],
                    reviews: [
                        { reviewer: "Lisa T.", rating: 5, text: "My apartment has never been so clean!" },
                        { reviewer: "Mark R.", rating: 4.8, text: "Very thorough and professional team." }
                    ]
                },
                { 
                    id: 3, 
                    name: "Dr. James Wilson", 
                    email: "james@servicehub.com",
                    password: "password123",
                    service: "Math & Science Tutoring", 
                    category: "Tutoring", 
                    price: "$75/hour", 
                    rating: 4.9,
                    availability: "Weekends & Evenings",
                    description: "PhD in Physics, 12+ years tutoring SAT/ACT, AP Calculus.",
                    fullDetail: "95% of students improve by 1+ letter grade. Customized worksheets.",
                    location: "Chicago, IL",
                    languages: ["English"],
                    yearsExperience: 12,
                    contactEmail: "james.wilson@servicehub.com",
                    contactPhone: "+1 (555) 456-7890",
                    avatarImg: "https://randomuser.me/api/portraits/men/45.jpg",
                    evidenceImg: "https://picsum.photos/id/20/1200/400",
                    verificationStatus: {
                        idVerified: true,
                        emailVerified: true,
                        paymentVerified: true,
                        backgroundChecked: true
                    },
                    credentials: [
                        "PhD in Physics - MIT",
                        "Certified Math Teacher",
                        "SAT/ACT Prep Specialist"
                    ],
                    servicesOffered: [
                        { name: "SAT/ACT Prep", price: "$85/hour", description: "Comprehensive test preparation" },
                        { name: "AP Physics/Math", price: "$75/hour", description: "Advanced placement tutoring" }
                    ],
                    reviews: [
                        { reviewer: "Parent", rating: 5, text: "SAT score improved by 200 points!" },
                        { reviewer: "Student", rating: 4.9, text: "Makes complex topics easy to understand." }
                    ]
                },
                { 
                    id: 4, 
                    name: "Demo Provider", 
                    email: "demo@servicehub.com",
                    password: "demo123",
                    service: "Demo Service - Try Me!", 
                    category: "Design", 
                    price: "Free", 
                    rating: 5.0,
                    availability: "24/7",
                    description: "This is a demo provider account. Click to see how ServiceHub works!",
                    fullDetail: "This is a demonstration provider to showcase how the ServiceHub platform works. Feel free to explore!",
                    location: "Online / Remote",
                    languages: ["English"],
                    yearsExperience: 1,
                    contactEmail: "demo@servicehub.com",
                    contactPhone: "+1 (555) 000-0000",
                    avatarImg: "https://randomuser.me/api/portraits/lego/1.jpg",
                    evidenceImg: "https://picsum.photos/id/1/1200/400",
                    verificationStatus: {
                        idVerified: true,
                        emailVerified: true,
                        paymentVerified: false,
                        backgroundChecked: true
                    },
                    credentials: [
                        "Demo Provider Certification",
                        "ServiceHub Ambassador"
                    ],
                    servicesOffered: [
                        { name: "Demo Service", price: "Free", description: "Try out the platform with this demo service" },
                        { name: "Platform Tutorial", price: "Free", description: "Learn how ServiceHub works" }
                    ],
                    reviews: [
                        { reviewer: "Test User", rating: 5, text: "Great way to test the platform!" }
                    ]
                }
            ];
            
            // Users (Seekers)
            this._users = [
                {
                    id: 1,
                    name: "John Doe",
                    email: "john@example.com",
                    password: "password123",
                    type: "seeker",
                    phone: "+1 (555) 0101",
                    avatarImg: "https://randomuser.me/api/portraits/men/1.jpg"
                },
                {
                    id: 2,
                    name: "Sarah Johnson",
                    email: "sarah@example.com",
                    password: "password123",
                    type: "seeker",
                    phone: "+1 (555) 0102",
                    avatarImg: "https://randomuser.me/api/portraits/women/2.jpg"
                },
                {
                    id: 3,
                    name: "Demo Seeker",
                    email: "seeker@example.com",
                    password: "demo123",
                    type: "seeker",
                    phone: "+1 (555) 0000",
                    avatarImg: "https://randomuser.me/api/portraits/lego/1.jpg"
                },
                {
                    id: 4,
                    name: "Demo Provider Account",
                    email: "provider@example.com",
                    password: "demo123",
                    type: "provider",
                    phone: "+1 (555) 0001",
                    avatarImg: "https://randomuser.me/api/portraits/lego/2.jpg"
                }
            ];
            
            // Requests
            this._requests = [
                { 
                    requestId: "REQ-1001", 
                    customerName: "John Doe", 
                    customerEmail: "john@example.com", 
                    customerPhone: "+1 (555) 123-4567", 
                    serviceName: "Academic Proofreading", 
                    preferredDate: "2025-05-15", 
                    preferredTime: "2:00 PM", 
                    location: "Boston, MA", 
                    budget: "$150", 
                    status: "pending", 
                    serviceDetails: "Need proofreading for my 50-page thesis. Deadline is May 20th. Need thorough grammar and style check." 
                },
                { 
                    requestId: "REQ-1002", 
                    customerName: "Sarah Johnson", 
                    customerEmail: "sarah@example.com", 
                    customerPhone: "+1 (555) 234-5678", 
                    serviceName: "Deep Cleaning Service", 
                    preferredDate: "2025-05-10", 
                    preferredTime: "10:00 AM", 
                    location: "Los Angeles, CA", 
                    budget: "$200", 
                    status: "completed", 
                    serviceDetails: "Deep cleaning for a 2-bedroom apartment. Move-out cleaning. Need special attention to kitchen and bathrooms." 
                },
                { 
                    requestId: "REQ-1003", 
                    customerName: "Michael Brown", 
                    customerEmail: "michael@example.com", 
                    customerPhone: "+1 (555) 345-6789", 
                    serviceName: "Math Tutoring", 
                    preferredDate: "2025-05-20", 
                    preferredTime: "4:00 PM", 
                    location: "Chicago, IL", 
                    budget: "$225", 
                    status: "accepted", 
                    serviceDetails: "Weekly tutoring for calculus. Need 2 sessions per week. Preparing for final exam." 
                },
                { 
                    requestId: "REQ-1004", 
                    customerName: "Emily Davis", 
                    customerEmail: "emily@example.com", 
                    customerPhone: "+1 (555) 456-7890", 
                    serviceName: "Brand Identity Design", 
                    preferredDate: "2025-06-01", 
                    preferredTime: "1:00 PM", 
                    location: "San Francisco, CA", 
                    budget: "$350", 
                    status: "completed", 
                    serviceDetails: "Need logo and brand guidelines for new startup. Have existing color preferences." 
                },
                { 
                    requestId: "REQ-1005", 
                    customerName: "David Wilson", 
                    customerEmail: "david@example.com", 
                    customerPhone: "+1 (555) 567-8901", 
                    serviceName: "Wedding Photography", 
                    preferredDate: "2025-05-25", 
                    preferredTime: "3:00 PM", 
                    location: "Seattle, WA", 
                    budget: "$800", 
                    status: "pending", 
                    serviceDetails: "Wedding photography for 50 guests. Need 4 hours coverage." 
                }
            ];
            
            this.saveToStorage();
            console.log('📝 Built-in data loaded with', this._providers.length, 'providers,', this._users.length, 'users');
        },

        // ============================================
        // SOLD PRODUCTS METHODS (from analytics.html)
        // ============================================
        
        loadSoldProducts: function() {
            const stored = localStorage.getItem(this._soldKey);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        this._soldProducts = parsed;
                    }
                } catch(e) {
                    console.error('Error loading sold products:', e);
                }
            }
            
            // Default sold products if empty
            if (this._soldProducts.length === 0) {
                this._soldProducts = [
                    { orderId: "ORD-001", productName: "Calculus Study Notes - Complete Guide", buyerName: "John Smith", buyerEmail: "john.smith@example.com", quantity: 1, totalPrice: "$45", purchaseDate: "2025-04-15", status: "delivered" },
                    { orderId: "ORD-002", productName: "Physics 101 - Exam Review Notes", buyerName: "Maria Garcia", buyerEmail: "maria.g@example.com", quantity: 2, totalPrice: "$60", purchaseDate: "2025-04-10", status: "delivered" },
                    { orderId: "ORD-003", productName: "English Literature - Poetry Analysis Journal", buyerName: "David Chen", buyerEmail: "david.chen@example.com", quantity: 1, totalPrice: "$35", purchaseDate: "2025-04-05", status: "delivered" },
                    { orderId: "ORD-004", productName: "Chemistry Lab Report Template Bundle", buyerName: "Lisa Wong", buyerEmail: "lisa.wong@example.com", quantity: 1, totalPrice: "$28", purchaseDate: "2025-03-28", status: "delivered" }
                ];
                this.saveSoldProducts();
            }
            
            return this._soldProducts;
        },
        
        saveSoldProducts: function() {
            localStorage.setItem(this._soldKey, JSON.stringify(this._soldProducts));
        },
        
        getAllSoldProducts: function() {
            return this._soldProducts || [];
        },
        addSoldProduct: function(product) {
            const newProduct = {
                orderId: 'ORD-' + Date.now(),
                ...product,
                purchaseDate: new Date().toISOString().split('T')[0],
                status: 'delivered'
            };
            this._soldProducts.push(newProduct);
            this.saveSoldProducts();
            return newProduct;
        },
        
        updateSoldProduct: function(orderId, updateData) {
            const index = this._soldProducts.findIndex(p => p.orderId === orderId);
            if (index !== -1) {
                this._soldProducts[index] = { ...this._soldProducts[index], ...updateData };
                this.saveSoldProducts();
                return this._soldProducts[index];
            }
            return null;
        },
        
        deleteSoldProduct: function(orderId) {
            const index = this._soldProducts.findIndex(p => p.orderId === orderId);
            if (index !== -1) {
                this._soldProducts.splice(index, 1);
                this.saveSoldProducts();
                return true;
            }
            return false;
        },
        
        // Analytics specific methods
        calculateRevenueStats: function() {
            const completed = this._requests.filter(r => r.status === 'completed').length;
            const totalSold = this._soldProducts.length;
            let totalRevenue = 0;
            
            this._soldProducts.forEach(p => {
                const price = parseFloat(p.totalPrice.replace('$', ''));
                if (!isNaN(price)) totalRevenue += price;
            });
            
            const totalRequests = this._requests.length;
            const completionRate = totalRequests > 0 ? ((completed / totalRequests) * 100).toFixed(1) : 0;
            
            // Calculate total requests value
            const totalRequestsValue = this._requests.reduce((sum, r) => {
                const budget = parseFloat(r.budget.replace('$', ''));
                return sum + (isNaN(budget) ? 0 : budget);
            }, 0);
            
            const averageOrderValue = totalSold > 0 ? (totalRevenue / totalSold).toFixed(2) : 0;
            
            return { 
                completed, 
                totalSold, 
                totalRevenue, 
                totalRequests, 
                completionRate,
                totalRequestsValue,
                averageOrderValue
            };
        },
        
        getMonthlySalesData: function() {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthlyRevenue = new Array(12).fill(0);
            const monthlyOrders = new Array(12).fill(0);
            
            this._soldProducts.forEach(product => {
                if (product.purchaseDate) {
                    const month = new Date(product.purchaseDate).getMonth();
                    const price = parseFloat(product.totalPrice.replace('$', ''));
                    if (!isNaN(price)) {
                        monthlyRevenue[month] += price;
                        monthlyOrders[month] += (product.quantity || 1);
                    }
                }
            });
            
            return { months, monthlyRevenue, monthlyOrders };
        },
        
        getStatusDistribution: function() {
            const pending = this._requests.filter(r => r.status === 'pending').length;
            const accepted = this._requests.filter(r => r.status === 'accepted').length;
            const completed = this._requests.filter(r => r.status === 'completed').length;
            const rejected = this._requests.filter(r => r.status === 'rejected').length;
            return { pending, accepted, completed, rejected };
        },
        
        getCompletedServices: function() {
            return this._requests.filter(r => r.status === 'completed');
        },
        
        // ============================================
        // AUTHENTICATION METHODS
        // ============================================
        
        getUserByEmail: function(email) {
            if (!email) return null;
            const emailLower = email.toLowerCase();
            
            const user = this._users.find(u => u.email && u.email.toLowerCase() === emailLower);
            if (user) {
                return { ...user, userType: user.type };
            }
            
            const provider = this._providers.find(p => p.email && p.email.toLowerCase() === emailLower);
            if (provider) {
                return { ...provider, userType: 'provider' };
            }
            
            return null;
        },
        
        authenticateUser: function(email, password) {
            const user = this.getUserByEmail(email);
            if (user && user.password === password) {
                console.log('✅ Authentication successful for:', user.name);
                return user;
            }
            console.log('❌ Authentication failed for:', email);
            return null;
        },
        
        registerUser: function(userData) {
            const newId = this._users.length + 1;
            const newUser = {
                id: newId,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                type: userData.type || "seeker",
                phone: userData.phone || "",
                avatarImg: "https://randomuser.me/api/portraits/lego/1.jpg",
                registeredAt: new Date().toISOString()
            };
            this._users.push(newUser);
            this.saveToStorage();
            console.log('✅ New user registered:', newUser.email);
            return newUser;
        },
        
        // ============================================
        // STORAGE METHODS
        // ============================================
        
        saveToStorage: function() {
            try {
                const data = {
                    version: "1.0",
                    lastUpdated: new Date().toISOString(),
                    providers: this._providers,
                    users: this._users,
                    requests: this._requests
                };
                localStorage.setItem(this._storageKey, JSON.stringify(data));
                console.log('💾 Saved to localStorage');
            } catch(e) {
                console.error('Save failed:', e);
            }
        },
        
        loadFromStorage: function() {
            try {
                const saved = localStorage.getItem(this._storageKey);
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch(e) {
                console.error('Load failed:', e);
            }
            return null;
        },
        
        // ============================================
        // PROVIDER METHODS
        // ============================================
        
        getAllProviders: function() {
            return this._providers || [];
        },
        
        getProviderById: function(id) {
            return this._providers.find(p => p.id === parseInt(id));
        },
        
        getProviderByName: function(name) {
            return this._providers.find(p => p.name === name);
        },
        
        getProvidersByCategory: function(category) {
            return this._providers.filter(p => p.category === category);
        },
        
        searchProviders: function(query) {
            if (!query) return this._providers;
            const searchTerm = query.toLowerCase();
            return this._providers.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.service.toLowerCase().includes(searchTerm) ||
                (p.category && p.category.toLowerCase().includes(searchTerm))
            );
        },
        
        getFeaturedProviders: function(limit = 4) {
            return [...this._providers].sort((a, b) => b.rating - a.rating).slice(0, limit);
        },
        
        getSimilarProviders: function(providerId, limit = 3) {
            const provider = this.getProviderById(providerId);
            if (!provider) return [];
            return this._providers.filter(p => p.id !== providerId && p.category === provider.category).slice(0, limit);
        },

        updateProvider: function(id, updateData) {
            const index = this._providers.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                this._providers[index] = { 
                    ...this._providers[index], 
                    ...updateData,
                    updatedAt: new Date().toISOString()
                };
                this.saveToStorage();
                console.log('✅ Provider updated:', id, updateData);
                return this._providers[index];
            }
            console.log('❌ Provider not found:', id);
            return null;
        },
        
        getProviderByEmail: function(email) {
            if (!email) return null;
            const emailLower = email.toLowerCase();
            return this._providers.find(p => p.email && p.email.toLowerCase() === emailLower);
        },
        
    // Add this entire block right before the showDatabase method in your database.js

        // ============================================
        // REQUEST DETAILS METHODS (from request_details.html)
        // ============================================
    
        // Helper: Get status badge class
        getStatusBadgeClass: function(status) {
            switch(status) {
                case 'pending': return 'status-pending';
                case 'accepted': return 'status-accepted';
                case 'payment_pending': return 'status-payment-pending';
                case 'completed': return 'status-completed';
                case 'rejected': return 'status-rejected';
                default: return 'status-pending';
            }
        },
        
        // Helper: Get status text
        getStatusText: function(status) {
            switch(status) {
                case 'pending': return 'Pending - Awaiting Response';
                case 'accepted': return 'Accepted - Ready for Payment';
                case 'payment_pending': return 'Payment Required';
                case 'completed': return 'Completed ✓';
                case 'rejected': return 'Rejected';
                default: return status;
            }
        },
    // Get status icon
    getStatusIcon: function(status) {
        switch(status) {
            case 'pending': return 'fa-hourglass-half';
            case 'accepted': return 'fa-check-circle';
            case 'payment_pending': return 'fa-credit-card';
            case 'processing': return 'fa-spinner fa-pulse';
            case 'completed': return 'fa-check-double';
            case 'rejected': return 'fa-times-circle';
            default: return 'fa-clock';
        }
    },
    // STEP 3: Provider requests payment (full or downpayment)
    requestPayment: function(requestId, paymentAmount, paymentType = 'full') {
        const request = this.getRequestById(requestId);
        if (!request) {
            console.log(`❌ Request ${requestId} not found`);
            return null;
        }
        
        if (request.status === 'accepted') {
            request.status = 'payment_pending';
            request.requestedPaymentAmount = paymentAmount;
            request.requestedPaymentType = paymentType;
            request.paymentRequestedAt = new Date().toISOString();
            this.saveToStorage();
            console.log(`💰 Payment requested for ${requestId}: $${paymentAmount} (${paymentType}) → status: payment_pending`);
            return request;
        }
        console.log(`❌ Cannot request payment. Current status: ${request.status}`);
        return null;
    },

        // STEP 4: Seeker makes payment - CRITICAL FIX
    makePayment: function(requestId, paymentAmount) {
        const request = this.getRequestById(requestId);
        if (!request) {
            console.log(`❌ Request ${requestId} not found`);
            return null;
        }
        
        console.log(`📋 makePayment called for ${requestId}`);
        console.log(`   Current status: ${request.status}`);
        console.log(`   Payment amount: ${paymentAmount}`);
        
        // Check if status is payment_pending
        if (request.status === 'payment_pending') {
            request.status = 'pending';
            request.paymentConfirmed = true;
            request.paymentAmount = paymentAmount;
            request.paymentConfirmedAt = new Date().toISOString();
            this.saveToStorage();
            console.log(`✅ Payment made for ${requestId}: $${paymentAmount} → status: pending (waiting for completion)`);
            return request;
        } 
        // Also handle 'accepted' status (in case payment is requested differently)
        else if (request.status === 'accepted') {
            request.status = 'pending';
            request.paymentConfirmed = true;
            request.paymentAmount = paymentAmount;
            request.paymentConfirmedAt = new Date().toISOString();
            this.saveToStorage();
            console.log(`✅ Payment made for ${requestId} from accepted status → status: pending`);
            return request;
        }
        else {
            console.log(`❌ Cannot process payment. Current status: ${request.status}, Expected: payment_pending or accepted`);
            return null;
        }
    },

    // STEP 5: Provider marks service as complete
    completeService: function(requestId) {
        const request = this.getRequestById(requestId);
        if (!request) {
            console.log(`❌ Request ${requestId} not found`);
            return null;
        }
        
        console.log(`📋 completeService called for ${requestId}`);
        console.log(`   Current status: ${request.status}`);
        console.log(`   Payment confirmed: ${request.paymentConfirmed}`);
        
        if (request.status === 'pending' && request.paymentConfirmed === true) {
            request.status = 'completed';
            request.completedAt = new Date().toISOString();
            this.saveToStorage();
            console.log(`✅ Service ${requestId} marked as complete → status: completed`);
            return request;
        }
        
        console.log(`❌ Cannot complete service. Status: ${request.status}, Payment confirmed: ${request.paymentConfirmed}`);
        return null;
    },

    // Get requests by status for tabs
    getRequestsByStatusForSeeker: function(userEmail, status) {
        const requests = this.getUserRequests(userEmail);
        return requests.filter(r => r.status === status);
    },

        // Helper to update request status (for accept/reject)
    updateRequestStatus: function(requestId, status, additionalData = {}) {
        const request = this.getRequestById(requestId);
        if (request) {
            request.status = status;
            request.statusUpdatedAt = new Date().toISOString();
            Object.assign(request, additionalData);
            this.saveToStorage();
            console.log(`✅ Request ${requestId} status updated to: ${status}`);
            return request;
        }
        return null;
    },
    // STEP 2: Provider accepts request
    acceptRequest: function(requestId) {
        return this.updateRequestStatus(requestId, 'accepted');
    },

    // Reject request with reason
    rejectRequest: function(requestId, reason) {
        const request = this.getRequestById(requestId);
        if (request && (request.status === 'pending' || request.status === 'accepted')) {
            request.status = 'rejected';
            request.rejectionReason = reason;
            request.statusUpdatedAt = new Date().toISOString();
            this.saveToStorage();
            console.log(`❌ Request ${requestId} rejected: ${reason}`);
            return request;
        }
        return null;
    },

    // Process payment (alternative method - for compatibility)
    processPayment: function(requestId, paymentAmount) {
        return this.makePayment(requestId, paymentAmount);
    },



        completeRequest: function(requestId) {
            return this.updateRequestStatus(requestId, 'completed', {
                completedAt: new Date().toISOString()
            });
        },

        confirmPayment: function(requestId, paymentAmount, paymentType) {
            const request = this.getRequestById(requestId);
            if (request && request.status === 'accepted') {
                request.status = 'confirmed';
                request.paymentConfirmed = true;
                request.paymentAmount = paymentAmount;
                request.paymentType = paymentType;
                request.paymentConfirmedAt = new Date().toISOString();
                this.saveToStorage();
                console.log(`✅ Payment confirmed for request ${requestId}: ${paymentType} of ${paymentAmount}`);
                return request;
            }
            return null;
        },

        setDownpayment: function(requestId, downpaymentAmount, note = '') {
            const request = this.getRequestById(requestId);
            if (request) {
                request.downpayment = downpaymentAmount;
                request.downpaymentNote = note || `Please pay ${downpaymentAmount} to confirm your booking.`;
                request.downpaymentRequestedAt = new Date().toISOString();
                this.saveToStorage();
                console.log(`💰 Downpayment set for request ${requestId}: ${downpaymentAmount}`);
                return request;
            }
            return null;
        },

        getPendingRequests: function() {
            return this._requests.filter(req => req.status === 'pending');
        },

        getAcceptedRequests: function() {
            return this._requests.filter(req => req.status === 'accepted');
        },

        getConfirmedRequests: function() {
            return this._requests.filter(req => req.status === 'confirmed');
        },

        getCompletedRequests: function() {
            return this._requests.filter(req => req.status === 'completed');
        },

        getRejectedRequests: function() {
            return this._requests.filter(req => req.status === 'rejected');
        },

        getRequestCountsByStatus: function(userEmail) {
            const userRequests = this.getUserRequests(userEmail);
            return {
                all: userRequests.length,
                pending: userRequests.filter(r => r.status === 'pending').length,
                accepted: userRequests.filter(r => r.status === 'accepted').length,
                confirmed: userRequests.filter(r => r.status === 'confirmed').length,
                completed: userRequests.filter(r => r.status === 'completed').length,
                rejected: userRequests.filter(r => r.status === 'rejected').length
            };
        },

    // Format request for display
        formatRequestForDisplay: function(request) {
            if (!request) return null;
            
            return {
                requestId: request.requestId,
                customerName: request.customerName || (request.requester?.name) || 'Unknown',
                customerEmail: request.customerEmail || (request.requester?.email) || 'Unknown',
                customerPhone: request.customerPhone || (request.requester?.phone) || 'Not provided',
                serviceName: request.serviceName || request.provider?.service || 'Unknown Service',
                preferredDate: request.preferredDate || 'Not set',
                preferredTime: request.preferredTime || 'Any time',
                location: request.location || 'Not provided',
                budget: request.budget || 'Contact for quote',
                status: request.status || 'pending',
                serviceDetails: request.serviceDetails || 'No additional details provided.',
                rejectionReason: request.rejectionReason || null,
                requestedPaymentAmount: request.requestedPaymentAmount || null,
                requestedPaymentType: request.requestedPaymentType || null,
                paymentConfirmed: request.paymentConfirmed || false,
                paymentAmount: request.paymentAmount || null,
                completedAt: request.completedAt
            };
        },
        // ============================================
        // END OF REQUEST DETAILS METHODS
        // ============================================
        
    // ============================================
    // REQUEST METHODS - FIXED VERSION
    // ============================================

    // In database.js, add/update these methods:
    getAllRequests: function() {
            return this._requests || [];
        },
        
        getStats: function() {
            return {
                totalProviders: this._providers.length,
                totalUsers: this._users.length,
                total: this._requests.length,
                totalRequests: this._requests.length,
                pending: this._requests.filter(r => r.status === 'pending').length,
                accepted: this._requests.filter(r => r.status === 'accepted').length,
                payment_pending: this._requests.filter(r => r.status === 'payment_pending').length,
                completed: this._requests.filter(r => r.status === 'completed').length,
                rejected: this._requests.filter(r => r.status === 'rejected').length
            };
        },

    // Also make sure getUserRequests is using the correct field names
    getUserRequests: function(userEmail) {
            if (!userEmail) return [];
            const emailLower = userEmail.toLowerCase();
            
            return this._requests.filter(req => {
                const reqEmail = req.customerEmail || 
                                req.requesterEmail ||
                                (req.requester && req.requester.email);
                return reqEmail && reqEmail.toLowerCase() === emailLower;
            });
        },
        
        getProviderRequests: function(providerName) {
            if (!providerName) return [];
            return this._requests.filter(req => 
                req.provider && req.provider.name === providerName
            );
        },
        

    getActiveRequestsCount: function(userEmail) {
        if (!userEmail) return 0;
        const emailLower = userEmail.toLowerCase();
        return this._requests.filter(req => {
            const reqEmail = req.customerEmail || 
                            (req.requester && req.requester.email) || 
                            req.requesterEmail;
            
            return reqEmail && 
                reqEmail.toLowerCase() === emailLower &&
                req.status !== 'rejected';
        }).length;
    },

    addRequest: function(requestData) {
            const normalizedData = {
                ...requestData,
                requestId: 'REQ-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'pending',  // Step 1: Status becomes "pending"
                customerEmail: requestData.customerEmail || 
                            (requestData.requester && requestData.requester.email),
                customerName: requestData.customerName || 
                            (requestData.requester && requestData.requester.name),
                customerPhone: requestData.customerPhone || 
                            (requestData.requester && requestData.requester.phone)
            };
            
            this._requests.push(normalizedData);
            this.saveToStorage();
            console.log('✅ Request added with status: pending');
            return normalizedData;
        },
        
        getRequestById: function(requestId) {
            return this._requests.find(req => req.requestId === requestId);
        },
    updateRequest: function(requestId, updateData) {
            const index = this._requests.findIndex(req => req.requestId === requestId);
            if (index !== -1) {
                this._requests[index] = {
                    ...this._requests[index],
                    ...updateData,
                    updatedAt: new Date().toISOString()
                };
                this.saveToStorage();
                return this._requests[index];
            }
            return null;
        },

    deleteRequest: function(requestId) {
            const index = this._requests.findIndex(req => req.requestId === requestId);
            if (index !== -1) {
                this._requests.splice(index, 1);
                this.saveToStorage();
                return true;
            }
            return false;
        },

    getRequestById: function(requestId) {
        if (!requestId) return null;
        return this._requests.find(req => req.requestId === requestId);
    },

    getRequestsByStatus: function(status, userEmail = null) {
        let filtered = this._requests.filter(req => req.status === status);
        if (userEmail) {
            const emailLower = userEmail.toLowerCase();
            filtered = filtered.filter(req => {
                const reqEmail = req.customerEmail || 
                                (req.requester && req.requester.email) || 
                                req.requesterEmail;
                return reqEmail && reqEmail.toLowerCase() === emailLower;
            });
        }
        return filtered;
    },


    
    
        
    
        showDatabase: function() {
            console.log('=== PROVIDERS ===');
            console.table(this._providers);
            console.log('=== USERS ===');
            console.table(this._users);
            console.log('=== REQUESTS ===');
            console.table(this._requests);
            console.log('=== SOLD PRODUCTS ===');
            console.table(this._soldProducts);
        }
    };


    // Initialize when script loads
    (async function() {
        await ServiceHubDB.init();
        window.ServiceHubDB = ServiceHubDB;
        console.log('🎯 ServiceHub Unified Database ready!');
        console.log('💡 Demo Accounts:');
        console.log('   Seeker: seeker@example.com / demo123');
        console.log('   Provider: provider@example.com / demo123');
    })();