import requests
import json

# Supabase API details
SUPABASE_URL = "https://hjmwtgqvmqaontbjebpi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbXd0Z3F2bXFhb250YmplYnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NjA0NzIsImV4cCI6MjA1OTEzNjQ3Mn0.M0JVWdQk14MPtTbL-q9zyPjl36kYotRTw7L-aF9iK_A"

# Function to add a blog post to Supabase
def add_blog_post(post_data):
    url = f"{SUPABASE_URL}/rest/v1/blog_posts"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    response = requests.post(url, headers=headers, json=post_data)
    
    if response.status_code == 201:
        print(f"Successfully added blog post: {post_data['title']}")
        return True
    else:
        print(f"Failed to add blog post: {post_data['title']}")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return False

# Blog post data
blog_posts = [
    {
        "slug": "the-joy-of-coloring-for-children",
        "title": "The Joy of Coloring for Children: Benefits and Fun Activities",
        "content": """
      <h2>The Educational Benefits of Coloring</h2>
      <p>Coloring is more than just a fun activity for children—it's a valuable educational tool that helps develop fine motor skills, hand-eye coordination, and concentration. When children color, they practice holding pencils or crayons properly, which strengthens the muscles in their hands and prepares them for writing.</p>
      
      <p>Coloring also helps children learn about boundaries, colors, perspective, patterns, and forms. They begin to understand spatial awareness and develop attention to detail as they work to stay within the lines and choose colors for different parts of the image.</p>
      
      <h2>How Coloring Encourages Creativity</h2>
      <p>While coloring pages provide structure, they also allow for creative expression. Children can experiment with different color combinations, creating unique interpretations of the same image. This freedom encourages them to think independently and make their own artistic choices.</p>
      
      <p>Coloring can also be a gateway to other forms of creativity. Children often begin to tell stories about the pictures they're coloring, imagining adventures and personalities for the characters on the page.</p>
      
      <h2>Coloring as a Stress-Reliever</h2>
      <p>In today's busy world, even children experience stress. Coloring provides a calming, mindful activity that helps children relax and focus on the present moment. The repetitive motion of coloring has been shown to reduce anxiety and create a meditative state.</p>
      
      <p>Setting aside time for coloring can be a wonderful way to help children unwind after school or during transitions between activities.</p>
      
      <h2>Fun Coloring Activities to Try</h2>
      <ul>
        <li><strong>Color and Learn:</strong> Use coloring pages that teach concepts like numbers, letters, or animals.</li>
        <li><strong>Seasonal Coloring:</strong> Choose images that match the current season or upcoming holidays.</li>
        <li><strong>Family Coloring Time:</strong> Make coloring a group activity where everyone works on their own page.</li>
        <li><strong>Coloring Stories:</strong> Create a series of coloring pages that tell a story when put together.</li>
      </ul>
      
      <h2>Getting Started with AI-Generated Coloring Pages</h2>
      <p>Our website offers unique, AI-generated coloring pages that you can't find anywhere else. These pages are created based on descriptions, allowing you to find or create exactly what interests your child. From dinosaurs to princesses, spaceships to underwater scenes—the possibilities are endless!</p>
      
      <p>Try creating your own custom coloring page today and watch your child's eyes light up when they see an image made just for them.</p>
    """,
        "meta_description": "Discover the educational benefits of coloring for children, creative coloring activities, and how coloring helps with stress relief and cognitive development.",
        "featured_image_url": "https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/steplead/coloringpage-1712018459177.png",
        "tags": ["children", "education", "creativity", "coloring benefits"],
        "is_published": True
    },
    {
        "slug": "adult-coloring-for-mindfulness",
        "title": "Adult Coloring for Mindfulness and Stress Relief",
        "content": """
      <h2>The Rise of Adult Coloring</h2>
      <p>In recent years, adult coloring has surged in popularity as people discover its calming effects. What was once considered a children's activity has transformed into a respected form of creative expression and stress management for adults of all ages.</p>
      
      <p>The popularity of adult coloring books began around 2013 and has continued to grow, with thousands of intricate designs specifically created for adult colorists. From geometric patterns to detailed nature scenes, the options are virtually limitless.</p>
      
      <h2>The Science Behind Coloring and Stress Relief</h2>
      <p>Numerous studies have demonstrated the stress-reducing benefits of coloring. When we color, our brains experience similar effects to meditation. The activity requires enough focus to keep our minds occupied but is simple enough that it doesn't create additional stress.</p>
      
      <p>Coloring activates different areas of our brain hemispheres – logic (through color selection and staying within lines) and creativity (through color mixing and artistic expression). This balanced brain activity creates a state of calm focus.</p>
      
      <h2>Mindfulness Through Coloring</h2>
      <p>Mindfulness – the practice of focusing completely on the present moment – is a powerful way to reduce anxiety and improve mental wellbeing. Coloring naturally encourages mindfulness as it requires your full attention on the simple act of applying color to paper.</p>
      
      <p>As you focus on staying within the lines and selecting colors, other concerns tend to fade into the background. Many people report losing track of time during coloring sessions – a classic sign of achieving a flow state, where you're completely absorbed in an enjoyable activity.</p>
      
      <h2>Getting Started with Adult Coloring</h2>
      <ul>
        <li><strong>Choose the Right Materials:</strong> Experiment with different mediums – colored pencils offer precision, while markers provide bold colors. Quality paper prevents bleeding.</li>
        <li><strong>Start Simple:</strong> Begin with less complex designs and work your way up to more intricate patterns.</li>
        <li><strong>Create a Coloring Space:</strong> Designate a comfortable area with good lighting for your coloring sessions.</li>
        <li><strong>Schedule Regular Sessions:</strong> Set aside dedicated time for coloring to establish it as a regular self-care practice.</li>
      </ul>
      
      <h2>Creating Custom Coloring Pages</h2>
      <p>While traditional coloring books offer wonderful options, creating your own custom coloring pages adds another dimension to the experience. Our AI-powered platform allows you to generate unique coloring pages based on your interests and preferences.</p>
      
      <p>Whether you're interested in architectural designs, botanical illustrations, or abstract patterns, you can generate custom coloring pages that perfectly match your aesthetic preferences. This personalization makes the coloring experience even more engaging and satisfying.</p>
      
      <p>Try our custom coloring page generator today and discover a new level of mindful creativity!</p>
    """,
        "meta_description": "Explore the mental health benefits of adult coloring, including stress reduction, improved focus, and mindfulness practice. Learn how to start your coloring journey.",
        "featured_image_url": "https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/steplead/coloringpage-1712018482983.png",
        "tags": ["adults", "mindfulness", "stress relief", "creativity"],
        "is_published": True
    },
    {
        "slug": "ai-technology-revolutionizing-coloring-pages",
        "title": "How AI Technology is Revolutionizing Coloring Pages",
        "content": """
      <h2>The Evolution of Coloring Pages</h2>
      <p>Coloring pages have come a long way from the simple line drawings found in children's books. Today, artificial intelligence is transforming how coloring pages are created, distributed, and enjoyed by people of all ages.</p>
      
      <p>Traditionally, coloring pages were designed by artists who manually drew outlines for people to color in. While these pages continue to be popular, they are limited by the artist's time, imagination, and expertise in different subject matters.</p>
      
      <h2>Enter AI-Generated Coloring Pages</h2>
      <p>Artificial intelligence has revolutionized the creation process by enabling computers to generate detailed coloring pages based on text descriptions. This technology opens up limitless possibilities, as users can request virtually any scene, character, or concept imaginable.</p>
      
      <p>AI models are trained on millions of images, allowing them to understand and visualize an incredible range of subjects - from realistic animals and landscapes to fantasy creatures and abstract concepts. What's more, these pages can be generated in seconds, providing instant gratification that traditional methods cannot match.</p>
      
      <h2>Personalization at Scale</h2>
      <p>Perhaps the most significant advantage of AI-generated coloring pages is the ability to personalize content at scale. No longer are coloring enthusiasts limited to what's available in stores or online. Instead, they can request exactly what they want:</p>
      
      <ul>
        <li><strong>Custom Themes:</strong> Pages that combine multiple elements (e.g., "a princess riding a dragon in space")</li>
        <li><strong>Educational Content:</strong> Subject-specific illustrations that make learning more engaging</li>
        <li><strong>Inclusive Representation:</strong> Characters that represent diverse cultures, abilities, and backgrounds</li>
        <li><strong>Varying Complexity:</strong> Pages suited to different skill levels, from beginner to advanced</li>
      </ul>
      
      <h2>The Technology Behind AI Coloring Pages</h2>
      <p>The AI technology powering these innovations relies primarily on sophisticated image generation models. These models use architectures like diffusion models that have been trained to convert text descriptions into detailed images.</p>
      
      <p>For coloring pages specifically, additional processing converts these generated images into line art suitable for coloring. This involves extracting edges and contours while removing color information - a technical process that produces clean, printable pages.</p>
      
      <h2>The Future of Coloring with AI</h2>
      <p>As AI technology continues to advance, we can expect even more impressive capabilities in coloring page generation. Future developments may include:</p>
      
      <ul>
        <li><strong>Interactive Pages:</strong> Coloring experiences that respond to how you're coloring them</li>
        <li><strong>Educational Integration:</strong> AI systems that create curriculum-aligned coloring activities</li>
        <li><strong>Style Customization:</strong> Ability to generate pages in specific artistic styles (e.g., anime, vintage, minimalist)</li>
        <li><strong>3D Coloring:</strong> Moving beyond flat pages to three-dimensional coloring experiences</li>
      </ul>
      
      <p>Our platform is at the forefront of this revolution, offering some of the most advanced AI-generated coloring pages available today. Try creating your own custom coloring page and experience the magic of AI creativity firsthand!</p>
    """,
        "meta_description": "Discover how artificial intelligence is transforming coloring pages with personalized designs, unlimited variety, and instant creation. Explore the technology and future of AI-generated coloring.",
        "featured_image_url": "https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/steplead/coloringpage-1712018502780.png",
        "tags": ["technology", "AI", "innovation", "digital art"],
        "is_published": True
    }
]

# Add all blog posts
for post in blog_posts:
    add_blog_post(post)

print("\nAll blog posts have been added. Please check your Supabase database or visit the blog page.")
print("Remember to visit https://www.ai-coloringpage.com/blog to see the blog section with your new posts!") 