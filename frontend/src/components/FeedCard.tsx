import React from 'react';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface FeedCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post, onClick }) => {
  const { currentUser } = useAuth();
  const isOwner = post.ownerId === currentUser?.id;
  const isAnon = post.isAnonymous;
  const displayOwner = isAnon ? 'أسرة متعففة' : post.ownerName;

  if (post.type === 'loan') {
    return (
      <div 
        onClick={() => onClick(post)}
        className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="relative h-48">
          <img 
            className="w-full h-full object-cover" 
            src={post.image} 
            alt={post.title} 
          />
          <div className="absolute top-3 right-3 bg-primary text-on-primary font-label-sm text-label-sm px-2 py-1 rounded-md shadow-sm">
            إعارة
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-title-lg text-title-lg text-on-surface line-clamp-1">{post.title}</h3>
            <span className="flex items-center gap-1 text-secondary font-label-sm text-label-sm shrink-0">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              {post.ownerRating || 4.9}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-2">
            {post.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/30">
            <div className="flex items-center gap-2">
              <img 
                className="w-8 h-8 rounded-full object-cover" 
                src={post.ownerAvatar} 
                alt={displayOwner} 
              />
              <div>
                <p className="font-label-sm text-label-sm text-on-surface">{displayOwner}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">{post.distanceLabel}</p>
              </div>
            </div>
            {isOwner ? (
              <span className="text-outline font-label-sm">طلبي</span>
            ) : (
              <button className="text-primary hover:bg-surface-container rounded-full p-2 transition-colors">
                <span className="material-symbols-outlined">chat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (post.type === 'gift') {
    return (
      <div 
        onClick={() => onClick(post)}
        className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2 py-1 rounded-md shadow-sm">
                هدية
              </span>
            </div>
          </div>
          <h3 className="font-title-lg text-title-lg text-on-surface mb-2">{post.title}</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-2">
            {post.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/30">
            <div className="flex items-center gap-2">
              {post.ownerAvatar ? (
                <img className="w-8 h-8 rounded-full object-cover" src={post.ownerAvatar} alt={displayOwner} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md">
                  {displayOwner.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-label-sm text-label-sm text-on-surface">{displayOwner}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">{post.distanceLabel}</p>
              </div>
            </div>
            {!isOwner && (
              <button className="bg-primary text-on-primary font-label-sm text-label-sm px-4 py-1.5 rounded-full hover:bg-opacity-90 transition-opacity">
                طلب
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Urgent type
  return (
    <div 
      onClick={() => onClick(post)}
      className="bg-error-container/10 rounded-xl shadow-sm border border-error-container overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-error">error</span>
          <span className="text-error font-label-md text-label-md">طلب مستعجل</span>
          {isAnon && (
            <span className="mr-auto px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-[10px] flex items-center gap-1 border border-outline-variant">
              <span className="material-symbols-outlined text-[12px]">shield_person</span>
              مستور
            </span>
          )}
        </div>
        <h3 className="font-title-lg text-title-lg text-on-surface mb-2">{post.title}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-3">
          {post.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-error-container">
          <div className="flex items-center gap-2">
            {isAnon ? (
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">shield_person</span>
              </div>
            ) : (
              <img 
                className="w-8 h-8 rounded-full object-cover" 
                src={post.ownerAvatar} 
                alt={displayOwner} 
              />
            )}
            <div>
              <p className="font-label-sm text-label-sm text-on-surface">{displayOwner}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">{post.distanceLabel}</p>
            </div>
          </div>
          {!isOwner && (
            <button className="text-secondary hover:bg-surface-container rounded-full p-2 transition-colors">
              <span className="material-symbols-outlined">handshake</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
