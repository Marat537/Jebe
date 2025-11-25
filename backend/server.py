from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import hashlib
import jwt
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'vyzo-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Helper Functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    username: str
    bio: Optional[str] = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    bio: str
    avatar: Optional[str] = None
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class VideoResponse(BaseModel):
    id: str
    video_url: str
    title: str
    author: str
    likes_count: int
    comments_count: int
    views: int
    created_at: datetime
    is_liked: bool = False

class CommentCreate(BaseModel):
    text: str
    image: Optional[str] = None  # base64 image

class CommentResponse(BaseModel):
    id: str
    user_id: str
    username: str
    text: str
    image: Optional[str] = None
    likes_count: int
    is_liked: bool
    created_at: datetime

class MessageCreate(BaseModel):
    receiver_id: str
    text: str
    image: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    sender_username: str
    receiver_id: str
    text: str
    image: Optional[str] = None
    read: bool
    created_at: datetime

class NotificationResponse(BaseModel):
    id: str
    type: str  # 'follow', 'like', 'comment'
    from_user_id: str
    from_username: str
    content: str
    video_id: Optional[str] = None
    read: bool
    created_at: datetime

class SearchHistoryResponse(BaseModel):
    id: str
    keyword: str
    created_at: datetime

class HotSearchResponse(BaseModel):
    keyword: str
    count: int

class SearchResultResponse(BaseModel):
    videos: List[VideoResponse]
    users: List[UserResponse]
    total_count: int

class WatchHistory(BaseModel):
    video_id: str
    watch_duration: float

# Initialize sample videos
async def initialize_videos():
    count = await db.videos.count_documents({})
    if count == 0:
        sample_videos = [
            {
                "_id": ObjectId(),
                "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "title": "Big Buck Bunny",
                "author": "Blender Foundation",
                "likes_count": 0,
                "comments_count": 0,
                "views": 0,
                "created_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "title": "Elephants Dream",
                "author": "Blender Foundation",
                "likes_count": 0,
                "comments_count": 0,
                "views": 0,
                "created_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "title": "For Bigger Blazes",
                "author": "Google",
                "likes_count": 0,
                "comments_count": 0,
                "views": 0,
                "created_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "title": "For Bigger Escapes",
                "author": "Google",
                "likes_count": 0,
                "comments_count": 0,
                "views": 0,
                "created_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "title": "For Bigger Fun",
                "author": "Google",
                "likes_count": 0,
                "comments_count": 0,
                "views": 0,
                "created_at": datetime.utcnow()
            }
        ]
        await db.videos.insert_many(sample_videos)
        logger.info("Sample videos initialized")

# Authentication Routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = {
        "_id": ObjectId(),
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "username": user_data.username,
        "bio": user_data.bio,
        "avatar": None,
        "created_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_access_token({"user_id": str(user_dict["_id"])})
    
    user_response = UserResponse(
        id=str(user_dict["_id"]),
        email=user_dict["email"],
        username=user_dict["username"],
        bio=user_dict["bio"],
        avatar=user_dict["avatar"],
        created_at=user_dict["created_at"]
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or user["password"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"user_id": str(user["_id"])})
    
    user_response = UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        username=user["username"],
        bio=user["bio"],
        avatar=user.get("avatar"),
        created_at=user["created_at"]
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        username=current_user["username"],
        bio=current_user["bio"],
        avatar=current_user.get("avatar"),
        created_at=current_user["created_at"]
    )

# Video Routes
@api_router.get("/videos/feed", response_model=List[VideoResponse])
async def get_video_feed(current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Get watch history
    watch_history = await db.watch_history.find({"user_id": user_id}).to_list(1000)
    watched_video_ids = [wh["video_id"] for wh in watch_history]
    
    # Get all videos
    videos = await db.videos.find().to_list(1000)
    
    # Simple recommendation: prioritize unwatched, then by engagement score
    video_responses = []
    for video in videos:
        video_id = str(video["_id"])
        
        # Check if user liked this video
        is_liked = await db.likes.find_one({"user_id": user_id, "video_id": video_id}) is not None
        
        # Calculate engagement score
        engagement_score = video["likes_count"] * 2 + video["comments_count"] * 3 + video["views"]
        is_watched = video_id in watched_video_ids
        
        video_responses.append({
            "video": VideoResponse(
                id=video_id,
                video_url=video["video_url"],
                title=video["title"],
                author=video["author"],
                likes_count=video["likes_count"],
                comments_count=video["comments_count"],
                views=video["views"],
                created_at=video["created_at"],
                is_liked=is_liked
            ),
            "engagement_score": engagement_score,
            "is_watched": is_watched
        })
    
    # Sort: unwatched first, then by engagement score
    video_responses.sort(key=lambda x: (x["is_watched"], -x["engagement_score"]))
    
    return [vr["video"] for vr in video_responses]

@api_router.post("/videos/{video_id}/view")
async def record_view(video_id: str, watch_data: WatchHistory, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Record watch history
    await db.watch_history.insert_one({
        "_id": ObjectId(),
        "user_id": user_id,
        "video_id": video_id,
        "watch_duration": watch_data.watch_duration,
        "created_at": datetime.utcnow()
    })
    
    # Increment view count
    await db.videos.update_one(
        {"_id": ObjectId(video_id)},
        {"$inc": {"views": 1}}
    )
    
    return {"success": True}

# Like Routes
@api_router.post("/videos/{video_id}/like")
async def like_video(video_id: str, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Check if already liked
    existing_like = await db.likes.find_one({"user_id": user_id, "video_id": video_id})
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked")
    
    # Create like
    await db.likes.insert_one({
        "_id": ObjectId(),
        "user_id": user_id,
        "video_id": video_id,
        "created_at": datetime.utcnow()
    })
    
    # Increment like count
    await db.videos.update_one(
        {"_id": ObjectId(video_id)},
        {"$inc": {"likes_count": 1}}
    )
    
    return {"success": True}

@api_router.delete("/videos/{video_id}/like")
async def unlike_video(video_id: str, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Remove like
    result = await db.likes.delete_one({"user_id": user_id, "video_id": video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=400, detail="Not liked")
    
    # Decrement like count
    await db.videos.update_one(
        {"_id": ObjectId(video_id)},
        {"$inc": {"likes_count": -1}}
    )
    
    return {"success": True}

# Comment Routes
@api_router.get("/videos/{video_id}/comments", response_model=List[CommentResponse])
async def get_comments(video_id: str, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    comments = await db.comments.find({"video_id": video_id}).sort("created_at", -1).to_list(1000)
    
    result = []
    for comment in comments:
        user = await db.users.find_one({"_id": ObjectId(comment["user_id"])})
        comment_id = str(comment["_id"])
        
        # Check if user liked this comment
        is_liked = await db.comment_likes.find_one({"user_id": user_id, "comment_id": comment_id}) is not None
        
        result.append(CommentResponse(
            id=comment_id,
            user_id=comment["user_id"],
            username=user["username"] if user else "Unknown",
            text=comment["text"],
            image=comment.get("image"),
            likes_count=comment.get("likes_count", 0),
            is_liked=is_liked,
            created_at=comment["created_at"]
        ))
    
    return result

@api_router.post("/videos/{video_id}/comments", response_model=CommentResponse)
async def create_comment(video_id: str, comment_data: CommentCreate, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    comment_dict = {
        "_id": ObjectId(),
        "user_id": user_id,
        "video_id": video_id,
        "text": comment_data.text,
        "image": comment_data.image,
        "likes_count": 0,
        "created_at": datetime.utcnow()
    }
    
    await db.comments.insert_one(comment_dict)
    
    # Increment comment count
    await db.videos.update_one(
        {"_id": ObjectId(video_id)},
        {"$inc": {"comments_count": 1}}
    )
    
    # Create notification for video owner
    video = await db.videos.find_one({"_id": ObjectId(video_id)})
    if video:
        await db.notifications.insert_one({
            "_id": ObjectId(),
            "user_id": video.get("author_id", ""),
            "type": "comment",
            "from_user_id": user_id,
            "from_username": current_user["username"],
            "content": f"评论了你的视频",
            "video_id": video_id,
            "read": False,
            "created_at": datetime.utcnow()
        })
    
    return CommentResponse(
        id=str(comment_dict["_id"]),
        user_id=user_id,
        username=current_user["username"],
        text=comment_dict["text"],
        image=comment_dict.get("image"),
        likes_count=0,
        is_liked=False,
        created_at=comment_dict["created_at"]
    )

# Comment Like Routes
@api_router.post("/comments/{comment_id}/like")
async def like_comment(comment_id: str, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Check if already liked
    existing_like = await db.comment_likes.find_one({"user_id": user_id, "comment_id": comment_id})
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked")
    
    # Create like
    await db.comment_likes.insert_one({
        "_id": ObjectId(),
        "user_id": user_id,
        "comment_id": comment_id,
        "created_at": datetime.utcnow()
    })
    
    # Increment like count
    await db.comments.update_one(
        {"_id": ObjectId(comment_id)},
        {"$inc": {"likes_count": 1}}
    )
    
    return {"success": True}

@api_router.delete("/comments/{comment_id}/like")
async def unlike_comment(comment_id: str, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Remove like
    result = await db.comment_likes.delete_one({"user_id": user_id, "comment_id": comment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=400, detail="Not liked")
    
    # Decrement like count
    await db.comments.update_one(
        {"_id": ObjectId(comment_id)},
        {"$inc": {"likes_count": -1}}
    )
    
    return {"success": True}

# Message Routes
@api_router.get("/messages", response_model=List[MessageResponse])
async def get_messages(current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    messages = await db.messages.find({
        "$or": [
            {"sender_id": user_id},
            {"receiver_id": user_id}
        ]
    }).sort("created_at", -1).to_list(1000)
    
    result = []
    for msg in messages:
        sender = await db.users.find_one({"_id": ObjectId(msg["sender_id"])})
        result.append(MessageResponse(
            id=str(msg["_id"]),
            sender_id=msg["sender_id"],
            sender_username=sender["username"] if sender else "Unknown",
            receiver_id=msg["receiver_id"],
            text=msg["text"],
            image=msg.get("image"),
            read=msg.get("read", False),
            created_at=msg["created_at"]
        ))
    
    return result

@api_router.post("/messages", response_model=MessageResponse)
async def send_message(message_data: MessageCreate, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    message_dict = {
        "_id": ObjectId(),
        "sender_id": user_id,
        "receiver_id": message_data.receiver_id,
        "text": message_data.text,
        "image": message_data.image,
        "read": False,
        "created_at": datetime.utcnow()
    }
    
    await db.messages.insert_one(message_dict)
    
    return MessageResponse(
        id=str(message_dict["_id"]),
        sender_id=user_id,
        sender_username=current_user["username"],
        receiver_id=message_data.receiver_id,
        text=message_dict["text"],
        image=message_dict.get("image"),
        read=False,
        created_at=message_dict["created_at"]
    )

# Notification Routes
@api_router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    notifications = await db.notifications.find({"user_id": user_id}).sort("created_at", -1).to_list(1000)
    
    return [NotificationResponse(
        id=str(notif["_id"]),
        type=notif["type"],
        from_user_id=notif["from_user_id"],
        from_username=notif["from_username"],
        content=notif["content"],
        video_id=notif.get("video_id"),
        read=notif.get("read", False),
        created_at=notif["created_at"]
    ) for notif in notifications]

@api_router.post("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user = Depends(get_current_user)):
    await db.notifications.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"read": True}}
    )
    return {"success": True}

# Follow Routes
@api_router.post("/users/{user_id}/follow")
async def follow_user(user_id: str, current_user = Depends(get_current_user)):
    follower_id = str(current_user["_id"])
    
    if follower_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    # Check if already following
    existing = await db.follows.find_one({"follower_id": follower_id, "following_id": user_id})
    if existing:
        raise HTTPException(status_code=400, detail="Already following")
    
    # Create follow
    await db.follows.insert_one({
        "_id": ObjectId(),
        "follower_id": follower_id,
        "following_id": user_id,
        "created_at": datetime.utcnow()
    })
    
    # Create notification
    await db.notifications.insert_one({
        "_id": ObjectId(),
        "user_id": user_id,
        "type": "follow",
        "from_user_id": follower_id,
        "from_username": current_user["username"],
        "content": "关注了你",
        "read": False,
        "created_at": datetime.utcnow()
    })
    
    return {"success": True}

@api_router.delete("/users/{user_id}/follow")
async def unfollow_user(user_id: str, current_user = Depends(get_current_user)):
    follower_id = str(current_user["_id"])
    
    result = await db.follows.delete_one({"follower_id": follower_id, "following_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=400, detail="Not following")
    
    return {"success": True}

# Search Routes
@api_router.post("/search/history")
async def save_search_history(keyword: str, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Save search history
    await db.search_history.insert_one({
        "_id": ObjectId(),
        "user_id": user_id,
        "keyword": keyword,
        "created_at": datetime.utcnow()
    })
    
    # Update global hot search count
    await db.hot_searches.update_one(
        {"keyword": keyword},
        {"$inc": {"count": 1}, "$set": {"updated_at": datetime.utcnow()}},
        upsert=True
    )
    
    return {"success": True}

@api_router.get("/search/history", response_model=List[SearchHistoryResponse])
async def get_search_history(current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    history = await db.search_history.find({"user_id": user_id}).sort("created_at", -1).limit(10).to_list(10)
    
    return [SearchHistoryResponse(
        id=str(h["_id"]),
        keyword=h["keyword"],
        created_at=h["created_at"]
    ) for h in history]

@api_router.delete("/search/history/{history_id}")
async def delete_search_history(history_id: str, current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    result = await db.search_history.delete_one({"_id": ObjectId(history_id), "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="History not found")
    
    return {"success": True}

@api_router.delete("/search/history")
async def clear_search_history(current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    await db.search_history.delete_many({"user_id": user_id})
    
    return {"success": True}

@api_router.get("/search/hot", response_model=List[HotSearchResponse])
async def get_hot_searches():
    hot_searches = await db.hot_searches.find().sort("count", -1).limit(10).to_list(10)
    
    return [HotSearchResponse(
        keyword=h["keyword"],
        count=h["count"]
    ) for h in hot_searches]

@api_router.get("/search", response_model=SearchResultResponse)
async def search(keyword: str, category: str = "all", current_user = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    videos = []
    users = []
    
    if category in ["all", "video"]:
        # Search videos
        video_results = await db.videos.find({
            "$or": [
                {"title": {"$regex": keyword, "$options": "i"}},
                {"author": {"$regex": keyword, "$options": "i"}}
            ]
        }).limit(20).to_list(20)
        
        for video in video_results:
            video_id = str(video["_id"])
            is_liked = await db.likes.find_one({"user_id": user_id, "video_id": video_id}) is not None
            
            videos.append(VideoResponse(
                id=video_id,
                video_url=video["video_url"],
                title=video["title"],
                author=video["author"],
                likes_count=video["likes_count"],
                comments_count=video["comments_count"],
                views=video["views"],
                created_at=video["created_at"],
                is_liked=is_liked
            ))
    
    if category in ["all", "user"]:
        # Search users
        user_results = await db.users.find({
            "$or": [
                {"username": {"$regex": keyword, "$options": "i"}},
                {"email": {"$regex": keyword, "$options": "i"}}
            ]
        }).limit(20).to_list(20)
        
        for u in user_results:
            users.append(UserResponse(
                id=str(u["_id"]),
                email=u["email"],
                username=u["username"],
                bio=u.get("bio", ""),
                avatar=u.get("avatar"),
                created_at=u["created_at"]
            ))
    
    return SearchResultResponse(
        videos=videos,
        users=users,
        total_count=len(videos) + len(users)
    )

@api_router.get("/")
async def root():
    return {"message": "Vyzo API v1.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await initialize_videos()
    logger.info("Vyzo API started successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
