"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize, Download, Share2, Heart, MessageCircle, PlayCircle, Send, Check } from "lucide-react";
import Image from "next/image";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthModal } from "./AuthModal";
import { sendAdminPushNotification } from "@/lib/firestore";

interface MediaLightboxProps {
  media: {
    url: string;
    type?: "image" | "video";
    cloudinaryId?: string; // used as the unique mediaId for interactions
  };
  isOpen: boolean;
  onClose: () => void;
}

export function MediaLightbox({ media, isOpen, onClose }: MediaLightboxProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Interaction states
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string, author: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const mediaId = media?.cloudinaryId ? media.cloudinaryId.replace(/\//g, '_') : encodeURIComponent(media?.url || "");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isOpen || !mediaId) return;

    // Listen to interactions doc (Likes)
    const interactionRef = doc(db, "media_interactions", mediaId);
    const unsubLikes = onSnapshot(interactionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const likedBy = data.likedBy || [];
        if (user?.uid) {
          setHasLiked(likedBy.includes(user.uid));
        } else {
          setHasLiked(false);
        }
        setLikesCount(likedBy.length);
      } else {
        setHasLiked(false);
        setLikesCount(0);
      }
    });

    // Listen to comments subcollection
    const commentsRef = collection(db, "media_interactions", mediaId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const unsubComments = onSnapshot(q, (snapshot) => {
      const comms: any[] = [];
      snapshot.forEach(d => comms.push({ id: d.id, ...d.data() }));
      setComments(comms);
    });

    return () => {
      unsubLikes();
      unsubComments();
    };
  }, [isOpen, mediaId, user]);

  const toggleLike = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!mediaId) return;
    const interactionRef = doc(db, "media_interactions", mediaId);
    
    // Check if doc exists first
    const snapshot = await getDoc(interactionRef);
    if (!snapshot.exists()) {
      await setDoc(interactionRef, { likedBy: [user.uid] });
      await sendAdminPushNotification("New Like! ❤️", `${user.displayName || "Someone"} liked your media.`);
      return;
    }

    if (hasLiked) {
      await updateDoc(interactionRef, { likedBy: arrayRemove(user.uid) });
    } else {
      await updateDoc(interactionRef, { likedBy: arrayUnion(user.uid) });
      await sendAdminPushNotification("New Like! ❤️", `${user.displayName || "Someone"} liked your media.`);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!newComment.trim() || !mediaId) return;

    const interactionRef = doc(db, "media_interactions", mediaId);
    const parentSnap = await getDoc(interactionRef);
    if (!parentSnap.exists()) {
      await setDoc(interactionRef, { likedBy: [] });
    }

    const commentText = newComment;
    const isReply = !!replyingTo;

    await addDoc(collection(db, "media_interactions", mediaId, "comments"), {
      text: commentText,
      author: user.displayName || "User",
      uid: user.uid,
      isAdmin: false,
      replyToId: replyingTo?.id || null,
      replyToName: replyingTo?.author || null,
      createdAt: serverTimestamp()
    });

    await sendAdminPushNotification(
      isReply ? "New Reply! 💬" : "New Comment! 💬", 
      `${user.displayName || "Someone"} commented: "${commentText.substring(0, 40)}..."`
    );

    setNewComment("");
    setReplyingTo(null);
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      // Cloudinary allows forcing a download by adding 'fl_attachment' to the URL
      let downloadUrl = media.url;
      if (downloadUrl.includes('/upload/')) {
        downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Aayesha_Media_${Date.now()}`;
      // In case it doesn't auto-download, open in new tab
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aayesha Enterprises Media',
          url: media.url,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(media.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen || !media) return null;

  const isVideo = media.type === "video" || media.url.includes(".mp4") || media.url.includes(".mov");

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className={`flex flex-col w-full h-full max-w-[1600px] p-4 pt-20 pb-24 ${isFullscreen ? 'p-0' : ''}`}>
            
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              {isVideo ? (
                <video 
                  src={media.url} 
                  controls 
                  autoPlay 
                  className={`max-w-full max-h-full ${isFullscreen ? 'w-screen h-screen object-contain' : 'rounded-lg'}`}
                />
              ) : (
                <Image 
                  src={media.url} 
                  alt="Preview" 
                  fill
                  className={`object-contain ${isFullscreen ? '' : 'rounded-lg'}`}
                  unoptimized
                />
              )}
            </div>

            {/* Bottom Action Bar */}
            {!isFullscreen && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-8 shadow-2xl"
              >
                <button onClick={toggleLike} className="flex flex-col items-center gap-1 group">
                  <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${hasLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  <span className="text-white/80 text-xs font-medium">{likesCount} Likes</span>
                </button>
                
                <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1 group">
                  <MessageCircle className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
                  <span className="text-white/80 text-xs font-medium">{comments.length} Comments</span>
                </button>

                <div className="w-px h-8 bg-white/20 mx-2" />

                <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
                  {isCopied ? <Check className="w-6 h-6 text-green-400" /> : <Share2 className="w-6 h-6 text-white transition-transform group-hover:scale-110" />}
                  <span className="text-white/80 text-xs font-medium">{isCopied ? "Copied" : "Share"}</span>
                </button>

                <button onClick={handleDownload} disabled={isDownloading} className="flex flex-col items-center gap-1 group">
                  <Download className={`w-6 h-6 text-white transition-transform ${isDownloading ? 'opacity-50' : 'group-hover:scale-110'}`} />
                  <span className="text-white/80 text-xs font-medium">{isDownloading ? "Downloading..." : "Download"}</span>
                </button>

                <button onClick={() => setIsFullscreen(true)} className="flex flex-col items-center gap-1 group">
                  <Maximize className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
                  <span className="text-white/80 text-xs font-medium">Full Screen</span>
                </button>
              </motion.div>
            )}

            {/* Fullscreen exit button overlay */}
            {isFullscreen && (
              <button 
                onClick={() => setIsFullscreen(false)}
                className="absolute bottom-8 right-8 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70"
              >
                <Maximize className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Comments Side Panel */}
          <AnimatePresence>
            {showComments && (
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col z-50"
              >
                <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                  <h3 className="text-xl font-bold font-heading">Comments ({comments.length})</h3>
                  <button onClick={() => setShowComments(false)} className="p-2 hover:bg-muted rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {comments.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">
                      No comments yet. Be the first to comment!
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="space-y-1 group">
                        <div className="flex items-baseline gap-2">
                          <span className={`font-semibold ${comment.isAdmin ? 'text-primary' : ''}`}>
                            {comment.author} {comment.isAdmin && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full ml-1 uppercase font-bold">✓ Admin</span>}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                        {comment.replyToName && (
                          <div className="text-xs text-primary bg-primary/10 inline-block px-2 py-1 rounded mb-1">
                            Replying to @{comment.replyToName}
                          </div>
                        )}
                        <p className="text-sm text-foreground/90">{comment.text}</p>
                        
                        <div className="pt-1">
                          <button 
                            onClick={() => {
                              if (!user) setShowAuthModal(true);
                              else setReplyingTo({ id: comment.id, author: comment.author });
                            }} 
                            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-border bg-card">
                  {replyingTo && (
                    <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-xl text-sm">
                      <span className="text-muted-foreground">
                        Replying to <span className="font-semibold text-foreground">@{replyingTo.author}</span>
                      </span>
                      <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-black/10 rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <form onSubmit={submitComment} className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={user ? "Write a comment..." : "Log in to comment..."}
                      onClick={() => !user && setShowAuthModal(true)}
                      readOnly={!user}
                      className={`flex-1 bg-muted border-none rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${replyingTo ? 'rounded-tl-none' : ''}`}
                    />
                    <button 
                      type="submit" 
                      disabled={!newComment.trim() || !user}
                      className="p-3 bg-primary text-primary-foreground rounded-full disabled:opacity-50 hover:bg-primary/90 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />
    </>
  );
}
