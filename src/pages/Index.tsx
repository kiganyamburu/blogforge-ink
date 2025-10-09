import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, ArrowRight, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
  author_id: string;
  featured_image: string | null;
  profiles: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

const Index = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  const fetchPublishedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username, full_name, avatar_url)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExcerpt = (post: Post) => {
    if (post.excerpt) return post.excerpt;
    const plainText = post.content.replace(/[#*`]/g, "").trim();
    return plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary-glow/10 border-b">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Welcome to BlogCMS
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern content management platform for creators. Write in Markdown, publish with SEO optimization, and collaborate with your team.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Markdown Editor</h3>
              <p className="text-muted-foreground">
                Write and format your content with Markdown. Live preview shows your post as you write.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">SEO Optimized</h3>
              <p className="text-muted-foreground">
                Built-in SEO tools with meta tags, descriptions, and clean URLs for better search rankings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Multi-Author</h3>
              <p className="text-muted-foreground">
                Collaborate with your team. Role-based access for admins, editors, and authors.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="container mx-auto px-4 py-16 bg-secondary/30">
        <h2 className="text-3xl font-bold text-center mb-12">Recent Posts</h2>
        
        {loading ? (
          <div className="text-center text-muted-foreground">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">No posts published yet</p>
            <Button onClick={() => navigate("/auth")}>Start Writing</Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {post.featured_image && (
                  <div 
                    className="w-full h-64 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/post/${post.slug}`)}
                  >
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {post.profiles?.username?.[0]?.toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {post.profiles?.full_name || post.profiles?.username || "Anonymous"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 
                      className="text-2xl font-bold mb-2 hover:text-primary cursor-pointer transition-colors"
                      onClick={() => navigate(`/post/${post.slug}`)}
                    >
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {getExcerpt(post)}
                    </p>
                  </div>

                  <Button 
                    variant="ghost" 
                    className="gap-2 px-0"
                    onClick={() => navigate(`/post/${post.slug}`)}
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-0">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to start writing?</h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join BlogCMS today and start creating beautiful, SEO-optimized content with our powerful Markdown editor.
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="gap-2">
              Create Your Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
