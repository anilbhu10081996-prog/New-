import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  ServiceItem,
  WorkerProfile,
  WorkPost,
  ProductItem,
  CartItem,
  OrderRecord,
  ServiceBooking,
  DeliveryBooking,
  JobVacancy,
  EducationCourse,
  ExamFolder,
  ExamTest,
  UserExamAttempt,
  NotificationItem,
  MembershipTier,
} from './types';
import {
  INITIAL_USER,
  ADMIN_USER,
  INITIAL_SERVICES,
  INITIAL_WORKERS,
  INITIAL_PRODUCTS,
  INITIAL_POSTED_WORKS,
  INITIAL_JOBS,
  INITIAL_COURSES,
  INITIAL_EXAM_FOLDERS,
  INITIAL_EXAM_TESTS,
} from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/home/HomeView';
import { CrackExamView } from './components/crackExam/CrackExamView';
import { ShopView } from './components/shop/ShopView';
import { ServicesAndWorkersView } from './components/services/ServicesAndWorkersView';
import { DeliveryView } from './components/delivery/DeliveryView';
import { EducationView } from './components/education/EducationView';
import { JobsView } from './components/jobs/JobsView';
import { MembershipView } from './components/membership/MembershipView';
import { AffiliateView } from './components/affiliate/AffiliateView';
import { SmartShopAIView } from './components/ai/SmartShopAIView';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { UserDashboardModal } from './components/user/UserDashboardModal';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { AuthModals } from './components/auth/AuthModals';
import { BusinessModal } from './components/business/BusinessModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // ================= STATE MANAGEMENT =================
  // User Session (persists in localStorage)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('anywork_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default start as Admin (anyworkservice24@gmail.com) so the user has immediate access to all audit features
    return ADMIN_USER;
  });

  const [currentView, setCurrentView] = useState<string>('home');

  // Domain Collections with localStorage sync
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_services');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SERVICES;
  });

  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_workers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WORKERS;
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PRODUCTS;
  });

  const [workPosts, setWorkPosts] = useState<WorkPost[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_workposts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_POSTED_WORKS;
  });

  const [jobs, setJobs] = useState<JobVacancy[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_jobs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_JOBS;
  });

  const [courses, setCourses] = useState<EducationCourse[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_courses');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_COURSES;
  });

  // Crack Exam Tests and Folders
  const [examFolders, setExamFolders] = useState<ExamFolder[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_exam_folders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_EXAM_FOLDERS;
  });

  const [examTests, setExamTests] = useState<ExamTest[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_exam_tests');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_EXAM_TESTS;
  });

  const [userExamAttempts, setUserExamAttempts] = useState<UserExamAttempt[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_exam_attempts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Bookings & Deliveries
  const [bookings, setBookings] = useState<ServiceBooking[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [deliveries, setDeliveries] = useState<DeliveryBooking[]>(() => {
    try {
      const saved = localStorage.getItem('anywork_deliveries');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n_1',
      title: 'Welcome to ANY WORK SERVICE',
      message: 'Explore verified technicians, Crack Exam test series, and hardware shop with same-day delivery.',
      type: 'info',
      time: 'Just now',
      read: false,
    },
    {
      id: 'n_2',
      title: 'SSC CGL Mock Test Paper Published',
      message: 'New official pattern Tier-1 mock test with real timer and negative marking is now live in Crack Exam.',
      type: 'success',
      time: '1h ago',
      read: false,
    },
  ]);

  // Modal Visibility States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [userDashboardOpen, setUserDashboardOpen] = useState(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);

  // Toast alert system
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('anywork_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('anywork_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('anywork_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('anywork_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('anywork_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('anywork_exam_tests', JSON.stringify(examTests));
  }, [examTests]);

  useEffect(() => {
    localStorage.setItem('anywork_exam_folders', JSON.stringify(examFolders));
  }, [examFolders]);

  useEffect(() => {
    localStorage.setItem('anywork_exam_attempts', JSON.stringify(userExamAttempts));
  }, [userExamAttempts]);

  useEffect(() => {
    localStorage.setItem('anywork_workposts', JSON.stringify(workPosts));
  }, [workPosts]);

  // ================= SHARE RULE IMPLEMENTATION =================
  const handleShare = async (title: string, text: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        showToast('Shared successfully!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(url);
          showToast('Link copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!');
    }
  };

  // ================= CART HANDLERS =================
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.title} to cart`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setNotifications((prev) => [
      {
        id: 'n_ord_' + Date.now(),
        title: 'Order Placed Successfully',
        message: `Order #${newOrder.id} for ₹${newOrder.total_amount} has been confirmed. Delivery expected in 24 hours.`,
        type: 'success',
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);
    showToast(`🎉 Order #${newOrder.id} placed successfully!`);
  };

  // ================= BOOKING HANDLERS =================
  const handleBookService = (booking: ServiceBooking) => {
    setBookings((prev) => [booking, ...prev]);
    setNotifications((prev) => [
      {
        id: 'n_bk_' + Date.now(),
        title: 'Service Booking Confirmed',
        message: `Technician appointment for "${booking.service_title}" scheduled for ${booking.booking_date} at ${booking.booking_time}.`,
        type: 'success',
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);
    showToast(`Service "${booking.service_title}" booked successfully!`);
  };

  const handleHireWorker = (worker: WorkerProfile) => {
    showToast(`Contacting verified technician ${worker.name} (${worker.phone})`);
  };

  const handlePostWork = (post: WorkPost) => {
    setWorkPosts((prev) => [post, ...prev]);
    showToast('Your work task has been published to the live board!');
  };

  const handleBookDelivery = (delivery: DeliveryBooking) => {
    setDeliveries((prev) => [delivery, ...prev]);
    setNotifications((prev) => [
      {
        id: 'n_dlv_' + Date.now(),
        title: 'Parcel Pickup Scheduled',
        message: `Tracking Number ${delivery.tracking_number}. Courier rider dispatched for pickup.`,
        type: 'info',
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);
    showToast(`Courier booked! Tracking #${delivery.tracking_number}`);
  };

  // ================= CRACK EXAM HANDLERS =================
  const handleSaveExamTest = (test: ExamTest) => {
    setExamTests((prev) => {
      const idx = prev.findIndex((t) => t.id === test.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = test;
        return updated;
      }
      return [test, ...prev];
    });
    showToast(`Test "${test.title}" saved successfully with ${test.questions.length} questions!`);
  };

  const handleDeleteExamTest = (testId: string) => {
    setExamTests((prev) => prev.filter((t) => t.id !== testId));
    showToast('Exam test removed.');
  };

  const handleTogglePublishExamTest = (testId: string) => {
    setExamTests((prev) =>
      prev.map((t) => {
        if (t.id === testId) {
          const nextState = !t.is_published;
          showToast(nextState ? 'Test is now PUBLISHED for students!' : 'Test moved to PRIVATE draft.');
          return { ...t, is_published: nextState };
        }
        return t;
      })
    );
  };

  const handleAddExamFolder = (folder: ExamFolder) => {
    setExamFolders((prev) => [...prev, folder]);
    showToast(`Folder "${folder.name}" created!`);
  };

  const handleRecordExamAttempt = (attempt: UserExamAttempt) => {
    setUserExamAttempts((prev) => [attempt, ...prev]);
    // increment attempts count on test
    setExamTests((prev) =>
      prev.map((t) => (t.id === attempt.test_id ? { ...t, attempts_count: t.attempts_count + 1 } : t))
    );
    showToast(`Exam score: ${attempt.score}/${attempt.total_marks} (${attempt.accuracy_percentage}% Accuracy)`);
  };

  // ================= USER & ADMIN HANDLERS =================
  const handleToggleVerifyWorker = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, verified: !w.verified } : w))
    );
    showToast('Worker verification status updated.');
  };

  const handleUpgradeTier = (tier: MembershipTier) => {
    setCurrentUser((prev) => ({ ...prev, membership: tier }));
    showToast(`Upgraded to ${tier.toUpperCase()} tier!`);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
    showToast('Profile updated successfully.');
  };

  const handleLogout = () => {
    // Switch between Admin and User profile
    if (currentUser.role === 'admin') {
      setCurrentUser(INITIAL_USER);
      showToast('Switched to Normal User mode (Guest)');
    } else {
      setCurrentUser(ADMIN_USER);
      showToast('Logged in as Admin (anyworkservice24@gmail.com)');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        currentUser={currentUser}
        currentView={currentView}
        cart={cart}
        notifications={notifications}
        onNavigate={(viewId) => {
          setCurrentView(viewId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenUserDashboard={() => setUserDashboardOpen(true)}
        onToggleNotifications={() => setNotificationsDrawerOpen(!notificationsDrawerOpen)}
        onOpenCart={() => setCurrentView('shop')}
        onShareWebsite={() =>
          handleShare(
            'ANY WORK SERVICE - Doorstep Services & Crack Exam Prep',
            'Find verified electricians, plumbers, shop tools and attempt live competitive exam tests on ANY WORK SERVICE!',
            window.location.origin
          )
        }
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'home' && (
          <HomeView
            currentUser={currentUser}
            services={services}
            workers={workers}
            products={products}
            tests={examTests}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookService={(srv) => {
              setCurrentView('services');
            }}
            onHireWorker={(w) => {
              setCurrentView('workers');
            }}
            onAddToCart={handleAddToCart}
            onOpenBusinessModal={() => setBusinessModalOpen(true)}
          />
        )}

        {currentView === 'services' && (
          <ServicesAndWorkersView
            currentUser={currentUser}
            services={services}
            workers={workers}
            workPosts={workPosts}
            onBookService={handleBookService}
            onPostWork={handlePostWork}
            onHireWorker={handleHireWorker}
          />
        )}

        {currentView === 'workers' && (
          <ServicesAndWorkersView
            currentUser={currentUser}
            services={services}
            workers={workers}
            workPosts={workPosts}
            onBookService={handleBookService}
            onPostWork={handlePostWork}
            onHireWorker={handleHireWorker}
          />
        )}

        {currentView === 'crack-exam' && (
          <CrackExamView
            currentUser={currentUser}
            tests={examTests}
            folders={examFolders}
            userAttempts={userExamAttempts}
            onSaveTest={handleSaveExamTest}
            onDeleteTest={handleDeleteExamTest}
            onTogglePublish={handleTogglePublishExamTest}
            onAddFolder={handleAddExamFolder}
            onRecordAttempt={handleRecordExamAttempt}
            onShare={handleShare}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            currentUser={currentUser}
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            onShare={handleShare}
          />
        )}

        {currentView === 'delivery' && (
          <DeliveryView
            currentUser={currentUser}
            deliveries={deliveries}
            onBookDelivery={handleBookDelivery}
          />
        )}

        {currentView === 'education' && (
          <EducationView
            currentUser={currentUser}
            courses={courses}
            onNavigateToCrackExam={() => setCurrentView('crack-exam')}
          />
        )}

        {currentView === 'jobs' && (
          <JobsView
            currentUser={currentUser}
            jobs={jobs}
            onApplyJob={(jobId, name) => showToast(`Application sent for job ${jobId}`)}
            onPostJob={(newJob) => {
              setJobs((prev) => [newJob, ...prev]);
              showToast(`Job opening "${newJob.title}" posted successfully!`);
            }}
          />
        )}

        {currentView === 'membership' && (
          <MembershipView
            currentUser={currentUser}
            onUpgradeTier={handleUpgradeTier}
          />
        )}

        {currentView === 'affiliate' && (
          <AffiliateView
            currentUser={currentUser}
            onShare={handleShare}
          />
        )}

        {currentView === 'ai-assistant' && (
          <SmartShopAIView
            services={services}
            products={products}
            onSelectService={(srv) => {
              setCurrentView('services');
            }}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      {/* Global Modals */}
      <AdminDashboardModal
        currentUser={currentUser}
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        usersList={[currentUser, INITIAL_USER]}
        services={services}
        workers={workers}
        orders={orders}
        bookings={bookings}
        tests={examTests}
        folders={examFolders}
        attempts={userExamAttempts}
        onToggleVerifyWorker={handleToggleVerifyWorker}
        onTogglePublishTest={handleTogglePublishExamTest}
        onDeleteTest={handleDeleteExamTest}
        onUpdateBookingStatus={(bkId, st) => {
          setBookings((prev) => prev.map((b) => (b.id === bkId ? { ...b, status: st } : b)));
          showToast('Booking status updated');
        }}
        onUpdateOrderStatus={(ordId, st) => {
          setOrders((prev) => prev.map((o) => (o.id === ordId ? { ...o, status: st } : o)));
          showToast('Order status updated');
        }}
      />

      <UserDashboardModal
        currentUser={currentUser}
        isOpen={userDashboardOpen}
        onClose={() => setUserDashboardOpen(false)}
        bookings={bookings}
        orders={orders}
        workPosts={workPosts}
        attempts={userExamAttempts}
        onUpdateProfile={handleUpdateProfile}
      />

      <NotificationsDrawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          showToast('All notifications marked as read');
        }}
        onClearAll={() => {
          setNotifications([]);
          showToast('All notifications cleared');
        }}
      />

      <AuthModals
        isOpen={authModalOpen}
        mode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.full_name}!`);
        }}
      />

      <BusinessModal
        isOpen={businessModalOpen}
        onClose={() => setBusinessModalOpen(false)}
        currentUser={currentUser}
        onSaveBusiness={(biz) => {
          showToast(`Business "${biz.name}" registered and published!`);
        }}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(viewId) => {
          setCurrentView(viewId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onShareWebsite={() =>
          handleShare(
            'ANY WORK SERVICE',
            'Find verified electricians, plumbers, shop tools and attempt live competitive exam tests on ANY WORK SERVICE!',
            window.location.origin
          )
        }
      />
    </div>
  );
}
