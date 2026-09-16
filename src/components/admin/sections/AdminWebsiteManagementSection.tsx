"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "@/lib/auth-context";
import { isConvexConfigured } from "@/lib/convex";
import {
  Megaphone,
  Calendar,
  Image as ImageIcon,
  FileSpreadsheet,
  Layers,
  MapPin,
  Building2,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  Loader2,
  Upload,
  Globe,
  DollarSign,
  AlertCircle,
  Clock,
  Eye,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

export type WebsiteTab =
  | "posts"
  | "events"
  | "gallery"
  | "fees"
  | "facilities"
  | "location"
  | "profile";

interface AdminWebsiteManagementSectionProps {
  initialTab?: WebsiteTab;
}

export const AdminWebsiteManagementSection: React.FC<AdminWebsiteManagementSectionProps> = ({
  initialTab = "posts",
}) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<WebsiteTab>(initialTab);

  // Synchronize when initialTab changes from parent
  useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const adminName = user?.name || "Administrator";
  const adminEmail = user?.email || "admin@isb.iqra.edu.pk";

  // =========================================================================
  // SUB-TAB 1: POSTS MANAGEMENT
  // =========================================================================
  const posts = useQuery(api.website.getAllPostsAdmin, isConvexConfigured ? {} : "skip");
  const createPostMutation = useMutation(api.website.createPost);
  const updatePostMutation = useMutation(api.website.updatePost);
  const deletePostMutation = useMutation(api.website.deletePost);
  const toggleFeaturedMutation = useMutation(api.website.togglePostFeatured);

  const [postSearch, setPostSearch] = useState("");
  const [postStatusFilter, setPostStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Post form fields
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    category: "University News",
    authorName: adminName,
    authorRole: "University Administration",
    publishDate: new Date().toISOString().split("T")[0],
    eventDate: "",
    tagsStr: "",
    status: "published" as "published" | "draft" | "archived",
    isFeatured: false,
    coverImage: "",
    additionalImagesStr: "",
  });

  const handleOpenCreatePost = () => {
    setEditingPost(null);
    setPostForm({
      title: "",
      content: "",
      category: "University News",
      authorName: adminName,
      authorRole: "University Administration",
      publishDate: new Date().toISOString().split("T")[0],
      eventDate: "",
      tagsStr: "University, Campus, News",
      status: "published",
      isFeatured: false,
      coverImage: "",
      additionalImagesStr: "",
    });
    setIsPostModalOpen(true);
  };

  const handleOpenEditPost = (p: any) => {
    setEditingPost(p);
    setPostForm({
      title: p.title,
      content: p.content,
      category: p.category,
      authorName: p.authorName,
      authorRole: p.authorRole || "",
      publishDate: p.publishDate,
      eventDate: p.eventDate || "",
      tagsStr: p.tags ? p.tags.join(", ") : "",
      status: p.status,
      isFeatured: p.isFeatured,
      coverImage: p.coverImage || "",
      additionalImagesStr: p.additionalImages ? p.additionalImages.join("\n") : "",
    });
    setIsPostModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      showToast("error", "Please provide a post title and content.");
      return;
    }

    const tags = postForm.tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const additionalImages = postForm.additionalImagesStr
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    try {
      if (editingPost) {
        await updatePostMutation({
          id: editingPost._id,
          title: postForm.title,
          content: postForm.content,
          category: postForm.category,
          authorName: postForm.authorName,
          authorRole: postForm.authorRole || undefined,
          publishDate: postForm.publishDate,
          eventDate: postForm.eventDate || undefined,
          tags,
          status: postForm.status,
          isFeatured: postForm.isFeatured,
          coverImage: postForm.coverImage || undefined,
          additionalImages,
          adminName,
          adminEmail,
        });
        showToast("success", "Post updated successfully.");
      } else {
        await createPostMutation({
          title: postForm.title,
          content: postForm.content,
          category: postForm.category,
          authorName: postForm.authorName,
          authorRole: postForm.authorRole || undefined,
          publishDate: postForm.publishDate,
          eventDate: postForm.eventDate || undefined,
          tags,
          status: postForm.status,
          isFeatured: postForm.isFeatured,
          coverImage: postForm.coverImage || undefined,
          additionalImages,
          adminName,
          adminEmail,
        });
        showToast("success", "Post created and published to Explore portal.");
      }
      setIsPostModalOpen(false);
    } catch (err: any) {
      showToast("error", err.message || "Failed to save post.");
    }
  };

  const handleDeletePost = async (id: Id<"universityPosts">) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePostMutation({ id, adminName, adminEmail });
      showToast("success", "Post deleted successfully.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete post.");
    }
  };

  // =========================================================================
  // SUB-TAB 2: EVENTS MANAGEMENT
  // =========================================================================
  const events = useQuery(api.website.getAllEventsAdmin, isConvexConfigured ? {} : "skip");
  const createEventMutation = useMutation(api.website.createEvent);
  const updateEventMutation = useMutation(api.website.updateEvent);
  const deleteEventMutation = useMutation(api.website.deleteEvent);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    category: "Academic",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM - 01:00 PM",
    location: "Main Auditorium, Chak Shezad Campus",
    imageUrl: "",
    registrationUrl: "",
    organizer: "Office of the Dean",
    status: "published" as "published" | "draft" | "cancelled",
    isFeatured: false,
  });

  const handleOpenCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      category: "Academic",
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM - 01:00 PM",
      location: "Main Auditorium, Chak Shezad Campus",
      imageUrl: "",
      registrationUrl: "",
      organizer: "Office of the Dean",
      status: "published",
      isFeatured: false,
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (e: any) => {
    setEditingEvent(e);
    setEventForm({
      title: e.title,
      description: e.description,
      category: e.category,
      date: e.date,
      time: e.time,
      location: e.location,
      imageUrl: e.imageUrl || "",
      registrationUrl: e.registrationUrl || "",
      organizer: e.organizer || "Office of the Dean",
      status: e.status,
      isFeatured: e.isFeatured,
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.location.trim()) {
      showToast("error", "Event title and location are required.");
      return;
    }

    try {
      if (editingEvent) {
        await updateEventMutation({
          id: editingEvent._id,
          title: eventForm.title,
          description: eventForm.description,
          category: eventForm.category,
          date: eventForm.date,
          time: eventForm.time,
          location: eventForm.location,
          imageUrl: eventForm.imageUrl || undefined,
          registrationUrl: eventForm.registrationUrl || undefined,
          organizer: eventForm.organizer,
          status: eventForm.status,
          isFeatured: eventForm.isFeatured,
          adminName,
          adminEmail,
        });
        showToast("success", "Event updated successfully.");
      } else {
        await createEventMutation({
          title: eventForm.title,
          description: eventForm.description,
          category: eventForm.category,
          date: eventForm.date,
          time: eventForm.time,
          location: eventForm.location,
          imageUrl: eventForm.imageUrl || undefined,
          registrationUrl: eventForm.registrationUrl || undefined,
          organizer: eventForm.organizer,
          status: eventForm.status,
          isFeatured: eventForm.isFeatured,
          adminName,
          adminEmail,
        });
        showToast("success", "Event created and published.");
      }
      setIsEventModalOpen(false);
    } catch (err: any) {
      showToast("error", err.message || "Failed to save event.");
    }
  };

  const handleDeleteEvent = async (id: Id<"universityEvents">) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEventMutation({ id, adminName, adminEmail });
      showToast("success", "Event deleted.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete event.");
    }
  };

  // =========================================================================
  // SUB-TAB 3: GALLERY MANAGEMENT
  // =========================================================================
  const gallery = useQuery(api.website.getAllGalleryAdmin, isConvexConfigured ? {} : "skip");
  const addGalleryMutation = useMutation(api.website.addGalleryImage);
  const deleteGalleryMutation = useMutation(api.website.deleteGalleryImage);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "Campus" as "Campus" | "Events" | "Students" | "Faculty" | "Facilities" | "Activities",
    imageUrl: "",
    description: "",
    featured: true,
  });

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.imageUrl.trim()) {
      showToast("error", "Image title and image URL are required.");
      return;
    }

    try {
      await addGalleryMutation({
        title: galleryForm.title,
        category: galleryForm.category,
        imageUrl: galleryForm.imageUrl,
        description: galleryForm.description || undefined,
        featured: galleryForm.featured,
        adminName,
        adminEmail,
      });
      showToast("success", "Photo added to campus gallery.");
      setIsGalleryModalOpen(false);
    } catch (err: any) {
      showToast("error", err.message || "Failed to add image.");
    }
  };

  const handleDeleteGallery = async (id: Id<"universityGallery">) => {
    if (!confirm("Delete this photo from gallery?")) return;
    try {
      await deleteGalleryMutation({ id, adminName, adminEmail });
      showToast("success", "Photo removed from gallery.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete photo.");
    }
  };

  // =========================================================================
  // SUB-TAB 4: FEE STRUCTURES MANAGEMENT
  // =========================================================================
  const fees = useQuery(api.website.getAllFeesAdmin, isConvexConfigured ? {} : "skip");
  const createFeeMutation = useMutation(api.website.createFeeStructure);
  const updateFeeMutation = useMutation(api.website.updateFeeStructure);
  const deleteFeeMutation = useMutation(api.website.deleteFeeStructure);

  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<any | null>(null);
  const [feeForm, setFeeForm] = useState({
    programName: "BS Computer Science",
    degreeLevel: "Undergraduate",
    semester: "First Semester",
    feeType: "Tuition Fee",
    amount: 145000,
    currency: "PKR",
    description: "Covers academic courses, faculty instruction, and campus computer lab access.",
    effectiveDate: "Fall 2026",
    status: "active" as "active" | "inactive",
  });

  const handleOpenCreateFee = () => {
    setEditingFee(null);
    setFeeForm({
      programName: "BS Computer Science",
      degreeLevel: "Undergraduate",
      semester: "First Semester",
      feeType: "Tuition Fee",
      amount: 145000,
      currency: "PKR",
      description: "Standard tuition and computing laboratory fee.",
      effectiveDate: "Fall 2026",
      status: "active",
    });
    setIsFeeModalOpen(true);
  };

  const handleOpenEditFee = (f: any) => {
    setEditingFee(f);
    setFeeForm({
      programName: f.programName,
      degreeLevel: f.degreeLevel,
      semester: f.semester,
      feeType: f.feeType,
      amount: f.amount,
      currency: f.currency,
      description: f.description || "",
      effectiveDate: f.effectiveDate,
      status: f.status,
    });
    setIsFeeModalOpen(true);
  };

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.programName.trim() || !feeForm.feeType.trim() || feeForm.amount <= 0) {
      showToast("error", "Please provide a program name, fee type, and valid amount.");
      return;
    }

    try {
      if (editingFee) {
        await updateFeeMutation({
          id: editingFee._id,
          programName: feeForm.programName,
          degreeLevel: feeForm.degreeLevel,
          semester: feeForm.semester,
          feeType: feeForm.feeType,
          amount: Number(feeForm.amount),
          currency: feeForm.currency,
          description: feeForm.description || undefined,
          effectiveDate: feeForm.effectiveDate,
          status: feeForm.status,
          adminName,
          adminEmail,
        });
        showToast("success", "Fee structure updated.");
      } else {
        await createFeeMutation({
          programName: feeForm.programName,
          degreeLevel: feeForm.degreeLevel,
          semester: feeForm.semester,
          feeType: feeForm.feeType,
          amount: Number(feeForm.amount),
          currency: feeForm.currency,
          description: feeForm.description || undefined,
          effectiveDate: feeForm.effectiveDate,
          status: feeForm.status,
          adminName,
          adminEmail,
        });
        showToast("success", "Fee structure created and published.");
      }
      setIsFeeModalOpen(false);
    } catch (err: any) {
      showToast("error", err.message || "Failed to save fee structure.");
    }
  };

  const handleDeleteFee = async (id: Id<"feeStructures">) => {
    if (!confirm("Are you sure you want to delete this fee item?")) return;
    try {
      await deleteFeeMutation({ id, adminName, adminEmail });
      showToast("success", "Fee item deleted.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete fee item.");
    }
  };

  // =========================================================================
  // SUB-TAB 5: FACILITIES MANAGEMENT
  // =========================================================================
  const facilities = useQuery(api.website.getAllFacilitiesAdmin, isConvexConfigured ? {} : "skip");
  const createFacilityMutation = useMutation(api.website.createFacility);
  const updateFacilityMutation = useMutation(api.website.updateFacility);
  const deleteFacilityMutation = useMutation(api.website.deleteFacility);

  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const [facilityForm, setFacilityForm] = useState({
    name: "Artificial Intelligence Research Lab",
    category: "Research" as "Academic" | "Research" | "Student Life" | "Sports" | "Administrative" | "Other",
    description: "Equipped with high-performance GPU clusters, neural network workstations, and IoT testing benches.",
    location: "Computing Block, 3rd Floor",
    imageUrl: "",
    status: "active" as "active" | "inactive",
  });

  const handleOpenCreateFacility = () => {
    setEditingFacility(null);
    setFacilityForm({
      name: "",
      category: "Academic",
      description: "",
      location: "Main Campus Building",
      imageUrl: "",
      status: "active",
    });
    setIsFacilityModalOpen(true);
  };

  const handleOpenEditFacility = (fac: any) => {
    setEditingFacility(fac);
    setFacilityForm({
      name: fac.name,
      category: fac.category,
      description: fac.description,
      location: fac.location,
      imageUrl: fac.imageUrl || "",
      status: fac.status,
    });
    setIsFacilityModalOpen(true);
  };

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.name.trim() || !facilityForm.description.trim()) {
      showToast("error", "Facility name and description are required.");
      return;
    }

    try {
      if (editingFacility) {
        await updateFacilityMutation({
          id: editingFacility._id,
          name: facilityForm.name,
          category: facilityForm.category,
          description: facilityForm.description,
          location: facilityForm.location,
          imageUrl: facilityForm.imageUrl || undefined,
          status: facilityForm.status,
          adminName,
          adminEmail,
        });
        showToast("success", "Facility updated.");
      } else {
        await createFacilityMutation({
          name: facilityForm.name,
          category: facilityForm.category,
          description: facilityForm.description,
          location: facilityForm.location,
          imageUrl: facilityForm.imageUrl || undefined,
          status: facilityForm.status,
          adminName,
          adminEmail,
        });
        showToast("success", "Facility created and published.");
      }
      setIsFacilityModalOpen(false);
    } catch (err: any) {
      showToast("error", err.message || "Failed to save facility.");
    }
  };

  const handleDeleteFacility = async (id: Id<"universityFacilities">) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;
    try {
      await deleteFacilityMutation({ id, adminName, adminEmail });
      showToast("success", "Facility removed.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete facility.");
    }
  };

  // =========================================================================
  // SUB-TAB 6: LOCATION CONFIGURATION
  // =========================================================================
  const locationData = useQuery(api.website.getUniversityLocation, isConvexConfigured ? {} : "skip");
  const updateLocationMutation = useMutation(api.website.updateUniversityLocation);

  const [locationForm, setLocationForm] = useState({
    campusName: "Chak Shezad Campus Islamabad",
    address: "Park Road, Chak Shezad, Islamabad, 45550, Federal Capital Area, Pakistan",
    city: "Islamabad",
    latitude: 33.6766,
    longitude: 73.1388,
    googleMapsUrl: "https://maps.google.com/?q=Iqra+University+Chak+Shezad+Campus+Islamabad",
    embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13280.771965561109!2d73.1300!3d33.6766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfeb22a2757a69%3A0x89dc8ec25f9b48b7!2sIqra%20University%2C%20Islamabad%20Campus!5e0!3m2!1sen!2spk!4v1710000000000!5m2!1sen!2spk",
    directions: "Directly accessible via Park Road, Islamabad Highway, and Kashmir Highway.",
    phone: "+92 51 111-264-264",
    email: "info@isb.iqra.edu.pk",
    officeHours: "Monday to Friday: 08:30 AM – 04:30 PM (Admissions: Saturday 09:00 AM – 01:00 PM)",
  });

  useEffect(() => {
    if (locationData) {
      setLocationForm({
        campusName: locationData.campusName,
        address: locationData.address,
        city: locationData.city,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        googleMapsUrl: locationData.googleMapsUrl,
        embedMapUrl: locationData.embedMapUrl || "",
        directions: locationData.directions || "",
        phone: locationData.phone || "+92 51 111-264-264",
        email: locationData.email || "info@isb.iqra.edu.pk",
        officeHours: locationData.officeHours || "",
      });
    }
  }, [locationData]);

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLocationMutation({
        campusName: locationForm.campusName,
        address: locationForm.address,
        city: locationForm.city,
        latitude: Number(locationForm.latitude),
        longitude: Number(locationForm.longitude),
        googleMapsUrl: locationForm.googleMapsUrl,
        embedMapUrl: locationForm.embedMapUrl || undefined,
        directions: locationForm.directions || undefined,
        phone: locationForm.phone || undefined,
        email: locationForm.email || undefined,
        officeHours: locationForm.officeHours || undefined,
        adminName,
        adminEmail,
      });
      showToast("success", "Campus location and map configuration saved.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to update location.");
    }
  };

  // =========================================================================
  // SUB-TAB 7: INSTITUTIONAL PROFILE
  // =========================================================================
  const profileData = useQuery(api.website.getUniversityProfile, isConvexConfigured ? {} : "skip");
  const updateProfileMutation = useMutation(api.website.updateUniversityProfile);

  const [profileForm, setProfileForm] = useState({
    name: "Iqra University",
    campusName: "Chak Shezad Campus, Islamabad",
    tagline: "Where Your Future Begins — Your Journey Towards Excellence Starts Here",
    overview: "",
    vision: "",
    mission: "",
    academicPhilosophy: "",
    campusExperience: "",
    history: "",
    phone: "+92 51 111-264-264",
    helpline: "+92 51 111-264-636",
    email: "info@isb.iqra.edu.pk",
    admissionsEmail: "admissions@isb.iqra.edu.pk",
    address: "Park Road, Chak Shezad, Islamabad, 45550, Pakistan",
    city: "Islamabad",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  });

  useEffect(() => {
    if (profileData) {
      setProfileForm({
        name: profileData.name,
        campusName: profileData.campusName,
        tagline: profileData.tagline,
        overview: profileData.overview,
        vision: profileData.vision,
        mission: profileData.mission,
        academicPhilosophy: profileData.academicPhilosophy,
        campusExperience: profileData.campusExperience,
        history: profileData.history,
        phone: profileData.phone,
        helpline: profileData.helpline,
        email: profileData.email,
        admissionsEmail: profileData.admissionsEmail,
        address: profileData.address,
        city: profileData.city,
        facebook: profileData.socialLinks?.facebook || "",
        twitter: profileData.socialLinks?.twitter || "",
        linkedin: profileData.socialLinks?.linkedin || "",
        instagram: profileData.socialLinks?.instagram || "",
        youtube: profileData.socialLinks?.youtube || "",
      });
    }
  }, [profileData]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation({
        name: profileForm.name,
        campusName: profileForm.campusName,
        tagline: profileForm.tagline,
        overview: profileForm.overview,
        vision: profileForm.vision,
        mission: profileForm.mission,
        coreValues: profileData?.coreValues || [
          { title: "Academic Distinction", description: "Outcome-based learning standards." },
          { title: "Integrity & Ethics", description: "Uncompromising honesty and transparency." },
        ],
        academicPhilosophy: profileForm.academicPhilosophy,
        campusExperience: profileForm.campusExperience,
        history: profileForm.history,
        leadership: profileData?.leadership || [
          { name: "Office of the Vice Chancellor", role: "Executive Leadership", designation: "Vice Chancellor" },
        ],
        phone: profileForm.phone,
        helpline: profileForm.helpline,
        email: profileForm.email,
        admissionsEmail: profileForm.admissionsEmail,
        address: profileForm.address,
        city: profileForm.city,
        socialLinks: {
          facebook: profileForm.facebook || undefined,
          twitter: profileForm.twitter || undefined,
          linkedin: profileForm.linkedin || undefined,
          instagram: profileForm.instagram || undefined,
          youtube: profileForm.youtube || undefined,
        },
        adminName,
        adminEmail,
      });
      showToast("success", "Institutional profile updated successfully.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to update profile.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Section Header with Public Portal Link */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Public University Portal CMS</span>
          </div>
          <h1 className="text-2xl font-black font-heading text-slate-900">
            University Website Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage the public-facing Explore University portal content, social media posts, news, events, fee structures, facilities, and campus map.
          </p>
        </div>

        <a
          href="/explore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm self-start md:self-auto shrink-0"
        >
          <span>Open Public Explore Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {[
          { id: "posts", label: "University Posts", icon: Megaphone },
          { id: "events", label: "Events", icon: Calendar },
          { id: "gallery", label: "Media & Gallery", icon: ImageIcon },
          { id: "fees", label: "Fee Structures", icon: FileSpreadsheet },
          { id: "facilities", label: "Campus Facilities", icon: Layers },
          { id: "location", label: "Map & Location", icon: MapPin },
          { id: "profile", label: "Institutional Profile", icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as WebsiteTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* 1. POSTS TAB */}
      {/* ===================================================================== */}
      {activeSubTab === "posts" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                placeholder="Search posts by title or category..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={postStatusFilter}
                onChange={(e) => setPostStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="archived">Archived</option>
              </select>

              <button
                onClick={handleOpenCreatePost}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
              <span>Post Title & Category</span>
              <span>Actions</span>
            </div>

            {posts === undefined ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No Posts Created Yet</p>
                <p className="text-xs text-slate-400">
                  Click &ldquo;Create Post&rdquo; to publish the first university post or news dispatch.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {posts
                  .filter((p) => {
                    if (postStatusFilter !== "all" && p.status !== postStatusFilter) return false;
                    if (
                      postSearch &&
                      !p.title.toLowerCase().includes(postSearch.toLowerCase()) &&
                      !p.category.toLowerCase().includes(postSearch.toLowerCase())
                    )
                      return false;
                    return true;
                  })
                  .map((p) => (
                    <div
                      key={p._id}
                      className="p-4 sm:p-5 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              p.status === "published"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "draft"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {p.status}
                          </span>
                          {p.isFeatured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Featured
                            </span>
                          )}
                          <span className="text-xs text-slate-400">{p.category}</span>
                          <span className="text-xs text-slate-400">• {p.publishDate}</span>
                        </div>
                        <h4 className="font-heading font-black text-sm text-slate-900 truncate">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{p.content}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => toggleFeaturedMutation({ id: p._id, isFeatured: !p.isFeatured })}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                            p.isFeatured
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "text-slate-500 border-slate-200 hover:bg-slate-100"
                          }`}
                          title="Toggle Featured on Explore Homepage"
                        >
                          {p.isFeatured ? "Featured" : "Feature"}
                        </button>
                        <button
                          onClick={() => handleOpenEditPost(p)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
                          title="Edit Post"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(p._id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. EVENTS TAB */}
      {/* ===================================================================== */}
      {activeSubTab === "events" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Events & Seminars</h2>
              <p className="text-xs text-slate-500">Scheduled academic talks, hackathons, and cultural events.</p>
            </div>
            <button
              onClick={handleOpenCreateEvent}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            {events === undefined ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No Events Scheduled</p>
                <p className="text-xs text-slate-400">Click &ldquo;Create Event&rdquo; to add an institutional event.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {events.map((e) => (
                  <div key={e._id} className="p-4 sm:p-5 hover:bg-slate-50 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {e.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">{e.date}</span>
                        <span className="text-xs text-slate-400">• {e.time}</span>
                      </div>
                      <h4 className="font-heading font-black text-sm text-slate-900">{e.title}</h4>
                      <p className="text-xs text-slate-500">{e.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditEvent(e)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200"
                        title="Edit Event"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(e._id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. GALLERY TAB */}
      {/* ===================================================================== */}
      {activeSubTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Photo Gallery</h2>
              <p className="text-xs text-slate-500">Official campus images displayed on the public gallery.</p>
            </div>
            <button
              onClick={() => setIsGalleryModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            {gallery === undefined ? (
              <div className="text-center text-xs text-slate-400 py-8">Loading gallery...</div>
            ) : gallery.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No Gallery Photos</p>
                <p className="text-xs text-slate-400">Add high-resolution campus photos to display on the Explore portal.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((img) => (
                  <div key={img._id} className="group relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-sm">
                    <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteGallery(img._id)}
                          className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-emerald-400 block">{img.category}</span>
                        <span className="text-xs font-bold truncate block">{img.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. FEE STRUCTURES TAB */}
      {/* ===================================================================== */}
      {activeSubTab === "fees" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Program Fee Schedules</h2>
              <p className="text-xs text-slate-500">Configure transparent fee structures by program and semester.</p>
            </div>
            <button
              onClick={handleOpenCreateFee}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Fee Item</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            {fees === undefined ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading fees...</div>
            ) : fees.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No Fee Structures Configured</p>
                <p className="text-xs text-slate-400">Click &ldquo;Add Fee Item&rdquo; to configure fees for programs.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Program</th>
                      <th className="px-5 py-3">Degree Level</th>
                      <th className="px-5 py-3">Fee Type</th>
                      <th className="px-5 py-3">Semester</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fees.map((f) => (
                      <tr key={f._id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-bold text-slate-900">{f.programName}</td>
                        <td className="px-5 py-3 text-slate-600">{f.degreeLevel}</td>
                        <td className="px-5 py-3 text-blue-600 font-semibold">{f.feeType}</td>
                        <td className="px-5 py-3 text-slate-600">{f.semester}</td>
                        <td className="px-5 py-3 font-mono font-bold text-slate-900">
                          {f.currency} {f.amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditFee(f)}
                              className="p-1 rounded text-slate-500 hover:text-blue-600"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFee(f._id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. FACILITIES TAB */}
      {/* ===================================================================== */}
      {activeSubTab === "facilities" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Facilities</h2>
              <p className="text-xs text-slate-500">Laboratories, lecture halls, and student amenities.</p>
            </div>
            <button
              onClick={handleOpenCreateFacility}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Facility</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            {facilities === undefined ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading facilities...</div>
            ) : facilities.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No Facilities Configured</p>
                <p className="text-xs text-slate-400">Add campus facilities to showcase on the public portal.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {facilities.map((fac) => (
                  <div key={fac._id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {fac.category}
                        </span>
                        <span className="text-xs text-slate-400">{fac.location}</span>
                      </div>
                      <h4 className="font-heading font-black text-sm text-slate-900">{fac.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{fac.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditFacility(fac)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 border border-slate-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFacility(fac._id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 border border-slate-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. LOCATION TAB */}
      {/* ===================================================================== */}
      {activeSubTab === "location" && (
        <form onSubmit={handleSaveLocation} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Campus Coordinates & Map Configuration</h2>
            <p className="text-xs text-slate-500">Configure university address, Google Maps URL, embed link, and visitor directions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Campus Name</label>
              <input
                type="text"
                value={locationForm.campusName}
                onChange={(e) => setLocationForm({ ...locationForm, campusName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">City</label>
              <input
                type="text"
                value={locationForm.city}
                onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Campus Physical Address</label>
            <input
              type="text"
              value={locationForm.address}
              onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Latitude</label>
              <input
                type="number"
                step="any"
                value={locationForm.latitude}
                onChange={(e) => setLocationForm({ ...locationForm, latitude: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Longitude</label>
              <input
                type="number"
                step="any"
                value={locationForm.longitude}
                onChange={(e) => setLocationForm({ ...locationForm, longitude: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Google Maps Direct URL</label>
            <input
              type="url"
              value={locationForm.googleMapsUrl}
              onChange={(e) => setLocationForm({ ...locationForm, googleMapsUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Google Maps Embed URL (Iframe src)</label>
            <input
              type="text"
              value={locationForm.embedMapUrl}
              onChange={(e) => setLocationForm({ ...locationForm, embedMapUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Directions & Public Transit Guidance</label>
            <textarea
              rows={3}
              value={locationForm.directions}
              onChange={(e) => setLocationForm({ ...locationForm, directions: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save Location Settings
          </button>
        </form>
      )}

      {/* ===================================================================== */}
      {/* 7. PROFILE TAB */}
      {/* ===================================================================== */}
      {activeSubTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Institutional Information & Overview</h2>
            <p className="text-xs text-slate-500">Official university description, vision, mission, and contact directory.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">University Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Campus Identity</label>
              <input
                type="text"
                value={profileForm.campusName}
                onChange={(e) => setProfileForm({ ...profileForm, campusName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Tagline / Motto</label>
            <input
              type="text"
              value={profileForm.tagline}
              onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">University Overview</label>
            <textarea
              rows={3}
              value={profileForm.overview}
              onChange={(e) => setProfileForm({ ...profileForm, overview: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Vision Statement</label>
              <textarea
                rows={3}
                value={profileForm.vision}
                onChange={(e) => setProfileForm({ ...profileForm, vision: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Mission Statement</label>
              <textarea
                rows={3}
                value={profileForm.mission}
                onChange={(e) => setProfileForm({ ...profileForm, mission: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Helpline Phone</label>
              <input
                type="text"
                value={profileForm.helpline}
                onChange={(e) => setProfileForm({ ...profileForm, helpline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Admissions Email</label>
              <input
                type="email"
                value={profileForm.admissionsEmail}
                onChange={(e) => setProfileForm({ ...profileForm, admissionsEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save Institutional Profile
          </button>
        </form>
      )}

      {/* ===================================================================== */}
      {/* POST CREATE / EDIT MODAL */}
      {/* ===================================================================== */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-heading font-black text-sm text-slate-900">
                {editingPost ? "Edit University Post" : "Create University Post"}
              </h3>
              <button onClick={() => setIsPostModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Post Title *</label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="e.g. AI University Launches New Deep Learning Research Initiative"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category *</label>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="University News">University News</option>
                    <option value="Announcements">Announcements</option>
                    <option value="Events">Events</option>
                    <option value="Achievements">Achievements</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Academic">Academic</option>
                    <option value="Admission">Admission</option>
                    <option value="Research & AI">Research & AI</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Publish Status *</label>
                  <select
                    value={postForm.status}
                    onChange={(e) => setPostForm({ ...postForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="published">Published (Live on Portal)</option>
                    <option value="draft">Draft (Private to Admin)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Content / Story *</label>
                <textarea
                  required
                  rows={5}
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  placeholder="Write the full post description..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Featured Cover Image URL</label>
                <input
                  type="text"
                  value={postForm.coverImage}
                  onChange={(e) => setPostForm({ ...postForm, coverImage: e.target.value })}
                  placeholder="https://... or /images/campus-hero.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Publish Date</label>
                  <input
                    type="date"
                    value={postForm.publishDate}
                    onChange={(e) => setPostForm({ ...postForm, publishDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Event Date (Optional)</label>
                  <input
                    type="date"
                    value={postForm.eventDate}
                    onChange={(e) => setPostForm({ ...postForm, eventDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={postForm.tagsStr}
                  onChange={(e) => setPostForm({ ...postForm, tagsStr: e.target.value })}
                  placeholder="AI, Research, Computing, Admission"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={postForm.isFeatured}
                  onChange={(e) => setPostForm({ ...postForm, isFeatured: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featuredToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Feature this post prominently on the Explore University homepage
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  {editingPost ? "Save Changes" : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* EVENT CREATE / EDIT MODAL */}
      {/* ===================================================================== */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-heading font-black text-sm text-slate-900">
                {editingEvent ? "Edit Event" : "Create Campus Event"}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. AI & Robotics National Symposium"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Time *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="10:00 AM - 01:00 PM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Campus Location *</label>
                <input
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Main Auditorium, Chak Shezad Campus"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Event agenda, keynote speaker details..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Image / Poster URL</label>
                <input
                  type="text"
                  value={eventForm.imageUrl}
                  onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Registration Link URL</label>
                <input
                  type="url"
                  value={eventForm.registrationUrl}
                  onChange={(e) => setEventForm({ ...eventForm, registrationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  {editingEvent ? "Save Changes" : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* GALLERY UPLOAD MODAL */}
      {/* ===================================================================== */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-heading font-black text-sm text-slate-900">Add Photo to Gallery</h3>
              <button onClick={() => setIsGalleryModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Central Library & Computing Hub"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category *</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                >
                  <option value="Campus">Campus</option>
                  <option value="Events">Events</option>
                  <option value="Students">Students</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Activities">Activities</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Image URL *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  placeholder="https://... or /images/campus-hero.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Caption / Description</label>
                <input
                  type="text"
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  placeholder="Brief description of the photograph"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FEE MODAL */}
      {/* ===================================================================== */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-heading font-black text-sm text-slate-900">
                {editingFee ? "Edit Fee Item" : "Add Fee Schedule Item"}
              </h3>
              <button onClick={() => setIsFeeModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFee} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Program Name *</label>
                <input
                  type="text"
                  required
                  value={feeForm.programName}
                  onChange={(e) => setFeeForm({ ...feeForm, programName: e.target.value })}
                  placeholder="e.g. BS Computer Science"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Degree Level</label>
                  <select
                    value={feeForm.degreeLevel}
                    onChange={(e) => setFeeForm({ ...feeForm, degreeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Semester Schedule</label>
                  <input
                    type="text"
                    value={feeForm.semester}
                    onChange={(e) => setFeeForm({ ...feeForm, semester: e.target.value })}
                    placeholder="First Semester"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Fee Type *</label>
                <input
                  type="text"
                  required
                  value={feeForm.feeType}
                  onChange={(e) => setFeeForm({ ...feeForm, feeType: e.target.value })}
                  placeholder="Tuition Fee / Admission Fee / Exam Fee"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Amount *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={feeForm.amount}
                    onChange={(e) => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Currency</label>
                  <input
                    type="text"
                    value={feeForm.currency}
                    onChange={(e) => setFeeForm({ ...feeForm, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Save Fee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FACILITY MODAL */}
      {/* ===================================================================== */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-heading font-black text-sm text-slate-900">
                {editingFacility ? "Edit Facility" : "Add Campus Facility"}
              </h3>
              <button onClick={() => setIsFacilityModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFacility} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Facility Name *</label>
                <input
                  type="text"
                  required
                  value={facilityForm.name}
                  onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                  placeholder="e.g. AI Deep Learning Lab"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={facilityForm.category}
                    onChange={(e) => setFacilityForm({ ...facilityForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Research">Research</option>
                    <option value="Student Life">Student Life</option>
                    <option value="Sports">Sports</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={facilityForm.location}
                    onChange={(e) => setFacilityForm({ ...facilityForm, location: e.target.value })}
                    placeholder="Block B, 2nd Floor"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={facilityForm.description}
                  onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })}
                  placeholder="Equipment and resources available..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Image URL</label>
                <input
                  type="text"
                  value={facilityForm.imageUrl}
                  onChange={(e) => setFacilityForm({ ...facilityForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFacilityModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
