import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, Globe } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    status: "draft",
    seo_title: "",
    seo_description: "",
    seo_keywords: [] as string[],
    published_at: null as string | null,
  });

  useEffect(() => {
    checkAuth();
    if (id) fetchPost();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || "",
        status: data.status,
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        seo_keywords: data.seo_keywords || [],
        published_at: data.published_at,
      });
    } catch (error: any) {
      toast.error("Failed to load post");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSave = async (publishStatus?: string) => {
    setSaving(true);
    try {
      const updateData: any = {
        ...post,
        slug: post.slug || generateSlug(post.title),
        seo_title: post.seo_title || post.title,
      };

      if (publishStatus) {
        updateData.status = publishStatus;
        if (publishStatus === "published" && !post.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from("posts")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
      toast.success(publishStatus === "published" ? "Post published!" : "Post saved");
      
      if (publishStatus === "published") {
        setTimeout(() => fetchPost(), 500);
      }
    } catch (error: any) {
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave()}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={saving}
            >
              <Globe className="h-4 w-4 mr-2" />
              {post.status === "published" ? "Update" : "Publish"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={(e) => {
                  setPost({ ...post, title: e.target.value });
                  if (!post.slug) {
                    setPost({ ...post, title: e.target.value, slug: generateSlug(e.target.value) });
                  }
                }}
                placeholder="Enter post title..."
                className="text-2xl font-bold h-auto py-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={post.slug}
                onChange={(e) => setPost({ ...post, slug: e.target.value })}
                placeholder="post-url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={post.excerpt}
                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                placeholder="Brief description of your post..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  value={post.content}
                  onChange={(e) => setPost({ ...post, content: e.target.value })}
                  placeholder="Write your post in Markdown..."
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Live Preview</Label>
                <Card className="h-[520px] overflow-auto">
                  <CardContent className="prose prose-sm dark:prose-invert max-w-none p-6">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="seo-title">SEO Title</Label>
              <Input
                id="seo-title"
                value={post.seo_title}
                onChange={(e) => setPost({ ...post, seo_title: e.target.value })}
                placeholder={post.title || "SEO optimized title..."}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {post.seo_title.length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                value={post.seo_description}
                onChange={(e) => setPost({ ...post, seo_description: e.target.value })}
                placeholder="SEO meta description..."
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {post.seo_description.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-keywords">Keywords (comma separated)</Label>
              <Input
                id="seo-keywords"
                value={post.seo_keywords.join(", ")}
                onChange={(e) =>
                  setPost({
                    ...post,
                    seo_keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                  })
                }
                placeholder="blog, cms, markdown"
              />
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="p-8">
                <article className="prose prose-lg dark:prose-invert max-w-none">
                  <h1>{post.title}</h1>
                  {post.excerpt && <p className="lead text-muted-foreground">{post.excerpt}</p>}
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}