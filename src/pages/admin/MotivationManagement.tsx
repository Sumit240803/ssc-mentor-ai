import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Quote, Lightbulb, Trophy, Plus, Pencil, Trash2, Heart } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import AdminSidebar from "@/components/AdminSidebar";

const MotivationManagement = () => {
  const { getMotivationalContent, createMotivationalContent, updateMotivationalContent, deleteMotivationalContent } = useAdmin();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    type: 'quote',
    category: 'General',
    is_daily: false,
    is_active: true
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const { data } = await getMotivationalContent();
    if (data) {
      setContent(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      type: 'quote',
      category: 'General',
      is_daily: false,
      is_active: true
    });
    setEditingContent(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title || '',
      content: item.content,
      author: item.author || '',
      type: item.type,
      category: item.category,
      is_daily: item.is_daily,
      is_active: item.is_active
    });
    setEditingContent(item);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContent) {
      await updateMotivationalContent(editingContent.id, formData);
    } else {
      await createMotivationalContent(formData);
    }
    
    resetForm();
    loadContent();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      await deleteMotivationalContent(id);
      loadContent();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quote': return Quote;
      case 'tip': return Lightbulb;
      case 'success': return Trophy;
      default: return Quote;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quote': return 'bg-blue-100 text-blue-800';
      case 'tip': return 'bg-green-100 text-green-800';
      case 'success': return 'bg-orange-100 text-orange-800';
      case 'article': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'General': 'bg-gray-100 text-gray-800',
      'Study Tips': 'bg-blue-100 text-blue-800',
      'Success Story': 'bg-orange-100 text-orange-800',
      'Motivation': 'bg-red-100 text-red-800',
      'Growth': 'bg-green-100 text-green-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Perseverance': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || colors['General'];
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Motivation Management</h1>
              <p className="text-muted-foreground mt-2">
                Create and manage motivational content for users
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Content
            </Button>
          </div>

          {/* Content Form */}
          {showForm && (
            <Card className="p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                {editingContent ? 'Edit Content' : 'Create New Content'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quote">Quote</SelectItem>
                        <SelectItem value="tip">Study Tip</SelectItem>
                        <SelectItem value="success">Success Story</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Study Tips">Study Tips</SelectItem>
                        <SelectItem value="Success Story">Success Story</SelectItem>
                        <SelectItem value="Motivation">Motivation</SelectItem>
                        <SelectItem value="Growth">Growth</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Perseverance">Perseverance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title (Optional)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Content title"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter the motivational content"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author (Optional)</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_daily"
                      checked={formData.is_daily}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_daily: checked })}
                    />
                    <Label htmlFor="is_daily">Daily Quote</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingContent ? 'Update Content' : 'Create Content'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Content List */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">All Motivational Content</h3>
            
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading content...</div>
            ) : content.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Quote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No content found. Create your first motivational content to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {content.map((item: any) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <div key={item.id} className="p-4 border rounded-lg hover:shadow-card transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-muted rounded-lg">
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            {item.title && (
                              <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                            )}
                            <p className="text-foreground mb-2 leading-relaxed">{item.content}</p>
                            {item.author && (
                              <p className="text-primary font-medium text-sm mb-2">- {item.author}</p>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getTypeColor(item.type)}>
                                {item.type}
                              </Badge>
                              <Badge className={getCategoryColor(item.category)}>
                                {item.category}
                              </Badge>
                              {item.is_daily && (
                                <Badge variant="secondary">Daily Quote</Badge>
                              )}
                              {!item.is_active && (
                                <Badge variant="destructive">Inactive</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {item.likes_count || 0} likes
                              </span>
                              <span>
                                Created: {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MotivationManagement;