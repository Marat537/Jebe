#!/usr/bin/env python3
"""
Vyzo API Backend Testing Suite
Tests all backend endpoints for the short video app MVP
"""

import requests
import json
import time
import os
from datetime import datetime

# Get backend URL from frontend environment
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('EXPO_PUBLIC_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

print(f"Testing Vyzo API at: {API_URL}")

class VyzoAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        self.video_ids = []
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        })
        
    def test_user_registration(self):
        """Test user registration endpoint"""
        print("\n=== Testing User Registration ===")
        
        # Test data with realistic information
        test_user = {
            "email": "sarah.johnson@example.com",
            "password": "SecurePass123!",
            "username": "sarah_creates",
            "bio": "Content creator passionate about storytelling and visual arts"
        }
        
        try:
            response = self.session.post(f"{API_URL}/auth/register", json=test_user)
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["access_token", "token_type", "user"]
                if all(field in data for field in required_fields):
                    self.auth_token = data["access_token"]
                    self.user_data = data["user"]
                    
                    # Set authorization header for future requests
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.auth_token}"
                    })
                    
                    self.log_test("User Registration", True, 
                                f"User registered successfully: {data['user']['username']}")
                    return True
                else:
                    self.log_test("User Registration", False, 
                                f"Missing required fields in response: {data}")
                    return False
            else:
                self.log_test("User Registration", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Exception: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test user login endpoint"""
        print("\n=== Testing User Login ===")
        
        # Use the same credentials from registration
        login_data = {
            "email": "sarah.johnson@example.com",
            "password": "SecurePass123!"
        }
        
        try:
            response = self.session.post(f"{API_URL}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                if "access_token" in data and "user" in data:
                    # Update token (should be the same, but good practice)
                    self.auth_token = data["access_token"]
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.auth_token}"
                    })
                    
                    self.log_test("User Login", True, 
                                f"Login successful for user: {data['user']['username']}")
                    return True
                else:
                    self.log_test("User Login", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("User Login", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Exception: {str(e)}")
            return False
    
    def test_get_current_user(self):
        """Test get current user endpoint"""
        print("\n=== Testing Get Current User ===")
        
        if not self.auth_token:
            self.log_test("Get Current User", False, "No auth token available")
            return False
        
        try:
            response = self.session.get(f"{API_URL}/auth/me")
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate user data
                required_fields = ["id", "email", "username", "bio", "created_at"]
                if all(field in data for field in required_fields):
                    self.log_test("Get Current User", True, 
                                f"User data retrieved: {data['username']}")
                    return True
                else:
                    self.log_test("Get Current User", False, 
                                f"Missing required fields: {data}")
                    return False
            else:
                self.log_test("Get Current User", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Current User", False, f"Exception: {str(e)}")
            return False
    
    def test_video_feed(self):
        """Test video feed endpoint"""
        print("\n=== Testing Video Feed ===")
        
        if not self.auth_token:
            self.log_test("Video Feed", False, "No auth token available")
            return False
        
        try:
            response = self.session.get(f"{API_URL}/videos/feed")
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list) and len(data) > 0:
                    # Store video IDs for later tests
                    self.video_ids = [video["id"] for video in data]
                    
                    # Validate video structure
                    first_video = data[0]
                    required_fields = ["id", "video_url", "title", "author", 
                                     "likes_count", "comments_count", "views", "created_at"]
                    
                    if all(field in first_video for field in required_fields):
                        self.log_test("Video Feed", True, 
                                    f"Retrieved {len(data)} videos successfully")
                        return True
                    else:
                        self.log_test("Video Feed", False, 
                                    f"Invalid video structure: {first_video}")
                        return False
                else:
                    self.log_test("Video Feed", False, 
                                f"Expected list of videos, got: {type(data)}")
                    return False
            else:
                self.log_test("Video Feed", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Video Feed", False, f"Exception: {str(e)}")
            return False
    
    def test_record_video_view(self):
        """Test recording video view"""
        print("\n=== Testing Record Video View ===")
        
        if not self.auth_token or not self.video_ids:
            self.log_test("Record Video View", False, 
                        "No auth token or video IDs available")
            return False
        
        video_id = self.video_ids[0]  # Use first video
        view_data = {
            "video_id": video_id,
            "watch_duration": 45.5  # 45.5 seconds
        }
        
        try:
            response = self.session.post(f"{API_URL}/videos/{video_id}/view", 
                                       json=view_data)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("success") is True:
                    self.log_test("Record Video View", True, 
                                f"View recorded for video {video_id}")
                    return True
                else:
                    self.log_test("Record Video View", False, 
                                f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Record Video View", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Record Video View", False, f"Exception: {str(e)}")
            return False
    
    def test_like_video(self):
        """Test liking a video"""
        print("\n=== Testing Like Video ===")
        
        if not self.auth_token or not self.video_ids:
            self.log_test("Like Video", False, 
                        "No auth token or video IDs available")
            return False
        
        video_id = self.video_ids[0]  # Use first video
        
        try:
            response = self.session.post(f"{API_URL}/videos/{video_id}/like")
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("success") is True:
                    self.log_test("Like Video", True, 
                                f"Video {video_id} liked successfully")
                    return True
                else:
                    self.log_test("Like Video", False, 
                                f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Like Video", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Like Video", False, f"Exception: {str(e)}")
            return False
    
    def test_unlike_video(self):
        """Test unliking a video"""
        print("\n=== Testing Unlike Video ===")
        
        if not self.auth_token or not self.video_ids:
            self.log_test("Unlike Video", False, 
                        "No auth token or video IDs available")
            return False
        
        video_id = self.video_ids[0]  # Use first video (should be liked from previous test)
        
        try:
            response = self.session.delete(f"{API_URL}/videos/{video_id}/like")
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("success") is True:
                    self.log_test("Unlike Video", True, 
                                f"Video {video_id} unliked successfully")
                    return True
                else:
                    self.log_test("Unlike Video", False, 
                                f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Unlike Video", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Unlike Video", False, f"Exception: {str(e)}")
            return False
    
    def test_get_video_comments(self):
        """Test getting video comments"""
        print("\n=== Testing Get Video Comments ===")
        
        if not self.auth_token or not self.video_ids:
            self.log_test("Get Video Comments", False, 
                        "No auth token or video IDs available")
            return False
        
        video_id = self.video_ids[0]  # Use first video
        
        try:
            response = self.session.get(f"{API_URL}/videos/{video_id}/comments")
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    self.log_test("Get Video Comments", True, 
                                f"Retrieved {len(data)} comments for video {video_id}")
                    return True
                else:
                    self.log_test("Get Video Comments", False, 
                                f"Expected list, got: {type(data)}")
                    return False
            else:
                self.log_test("Get Video Comments", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Video Comments", False, f"Exception: {str(e)}")
            return False
    
    def test_create_comment(self):
        """Test creating a comment"""
        print("\n=== Testing Create Comment ===")
        
        if not self.auth_token or not self.video_ids:
            self.log_test("Create Comment", False, 
                        "No auth token or video IDs available")
            return False
        
        video_id = self.video_ids[0]  # Use first video
        comment_data = {
            "text": "Amazing video! The cinematography is absolutely stunning. Love the creative storytelling approach! 🎬✨"
        }
        
        try:
            response = self.session.post(f"{API_URL}/videos/{video_id}/comments", 
                                       json=comment_data)
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate comment structure
                required_fields = ["id", "user_id", "username", "text", "created_at"]
                if all(field in data for field in required_fields):
                    self.log_test("Create Comment", True, 
                                f"Comment created successfully: {data['text'][:50]}...")
                    return True
                else:
                    self.log_test("Create Comment", False, 
                                f"Invalid comment structure: {data}")
                    return False
            else:
                self.log_test("Create Comment", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Comment", False, f"Exception: {str(e)}")
            return False
    
    def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("\n=== Testing Complete Authentication Flow ===")
        
        # Test without token (should fail)
        temp_session = requests.Session()
        try:
            response = temp_session.get(f"{API_URL}/auth/me")
            if response.status_code == 401:
                self.log_test("Auth Flow - No Token", True, 
                            "Correctly rejected request without token")
            else:
                self.log_test("Auth Flow - No Token", False, 
                            f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Auth Flow - No Token", False, f"Exception: {str(e)}")
        
        # Test with invalid token (should fail)
        temp_session.headers.update({"Authorization": "Bearer invalid_token"})
        try:
            response = temp_session.get(f"{API_URL}/auth/me")
            if response.status_code == 401:
                self.log_test("Auth Flow - Invalid Token", True, 
                            "Correctly rejected request with invalid token")
            else:
                self.log_test("Auth Flow - Invalid Token", False, 
                            f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Auth Flow - Invalid Token", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Vyzo API Backend Tests")
        print("=" * 50)
        
        # Authentication tests
        if not self.test_user_registration():
            print("❌ Registration failed - stopping tests")
            return False
        
        if not self.test_user_login():
            print("❌ Login failed - stopping tests")
            return False
        
        if not self.test_get_current_user():
            print("❌ Get current user failed - stopping tests")
            return False
        
        # Video feed tests
        if not self.test_video_feed():
            print("❌ Video feed failed - stopping video tests")
        else:
            # Video interaction tests (only if feed works)
            self.test_record_video_view()
            self.test_like_video()
            self.test_unlike_video()
            self.test_get_video_comments()
            self.test_create_comment()
        
        # Additional authentication tests
        self.test_authentication_flow()
        
        # Print summary
        self.print_test_summary()
        
        return True
    
    def print_test_summary(self):
        """Print test summary"""
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Show failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['message']}")
        
        print("\n" + "=" * 50)

def main():
    """Main test execution"""
    tester = VyzoAPITester()
    
    try:
        tester.run_all_tests()
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
    
    print("\n🏁 Testing completed!")

if __name__ == "__main__":
    main()