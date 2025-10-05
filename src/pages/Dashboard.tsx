import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const createNewPost = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const slug = `draft-${Date.now()}`;
      const { data, error } = await supabase
        .from("posts")
        .insert({
          author_id: session.user.id,
          title: "Untitled Post",
          slug,
          content: "# Start writing...",
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;
      navigate(`/editor/${data.id}`);
    } catch (error: any) {
      toast.error("Failed to create post");
    }
  };

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === "published").length,
    drafts: posts.filter(p => p.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Button onClick={createNewPost} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Post
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.drafts}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Posts</CardTitle>
            <CardDescription>
              Click on a post to edit it
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Button onClick={createNewPost}>Create your first post</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/editor/${post.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-primary cursor-pointer transition-all group"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date(post.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === "published" ? (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}