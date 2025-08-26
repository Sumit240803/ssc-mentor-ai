import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Eye, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/AdminSidebar";

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

const PostModeration = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // First get posts
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Then get profiles for each post
      const postsWithProfiles = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', post.user_id)
            .single();
          
          return {
            ...post,
            profiles: profileData
          };
        })
      );

      setPosts(postsWithProfiles);
    } catch (error: any) {
      toast({
        title: "Error loading posts",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Post Moderation
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage user-generated content
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 mb-6 border-0 shadow-card">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts by title, content, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="shrink-0">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-0 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                  <p className="text-3xl font-bold text-foreground">{posts.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <Eye className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Posts</p>
                  <p className="text-3xl font-bold text-foreground">
                    {posts.filter(post => 
                      new Date(post.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Authors</p>
                  <p className="text-3xl font-bold text-foreground">
                    {new Set(posts.map(post => post.user_id)).size}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-50">
                  <AlertTriangle className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Posts List */}
          <Card className="p-6 border-0 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">
                All Posts ({filteredPosts.length})
              </h3>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No posts found</p>
                {searchTerm && <p className="text-sm">Try adjusting your search criteria</p>}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="p-4 border shadow-sm hover:shadow-elevated transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">{post.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {post.profiles?.full_name || 'Unknown User'}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                          <div>Author: {post.profiles?.email}</div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedPost(post)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Post
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this post? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deletePost(post.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Post Detail Modal */}
          {selectedPost && (
            <AlertDialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
              <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>{selectedPost.title}</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span>Author: {selectedPost.profiles?.full_name}</span>
                        <span>Email: {selectedPost.profiles?.email}</span>
                        <span>Created: {new Date(selectedPost.created_at).toLocaleString()}</span>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedPost(null)}>
                    Close
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => {
                      deletePost(selectedPost.id);
                      setSelectedPost(null);
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Post
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModeration;