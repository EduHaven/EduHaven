import { useState, useEffect } from "react"
import { Book, Laptop, Code, Palette, Brain, Microscope, ShoppingCart, Star, Search, X, Filter, ChevronDown } from "lucide-react"
import CourseRoomShimmer from '../components/shimmerUI/shimmerCourse';

const courses = [
  {
    id: 1,
    name: "Web Development Fundamentals",
    icon: Code,
    students: 1234,
    level: "Beginner",
    tutor: "John Doe",
    price: 49.99,
    rating: 4.5,
    description: "Learn the basics of web development including HTML, CSS, and JavaScript. Perfect for beginners looking to start their coding journey.",
    topics: ["HTML5", "CSS3", "JavaScript Basics", "Responsive Design", "Web Accessibility"],
    duration: "12 weeks",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Advanced Machine Learning",
    icon: Brain,
    students: 890,
    level: "Advanced",
    tutor: "Jane Smith",
    price: 79.99,
    rating: 4.8,
    description: "Deep dive into advanced machine learning concepts and algorithms. Ideal for those with programming and basic ML knowledge.",
    topics: ["Neural Networks", "Deep Learning", "Computer Vision", "NLP", "Reinforcement Learning"],
    duration: "16 weeks",
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Digital Art and Illustration",
    icon: Palette,
    students: 2567,
    level: "Intermediate",
    tutor: "Alex Johnson",
    price: 59.99,
    rating: 4.2,
    description: "Master digital art creation using industry-standard tools. Learn techniques for illustration, character design, and digital painting.",
    topics: ["Digital Drawing", "Color Theory", "Composition", "Character Design", "Digital Painting"],
    duration: "10 weeks",
    image: "https://cdn.dribbble.com/users/418188/screenshots/6471262/digital_illustration_in_progress_tubik_4x.png?resize=400x300&vertical=center",
  },
  {
    id: 4,
    name: "Data Science Essentials",
    icon: Microscope,
    students: 678,
    level: "Beginner",
    tutor: "Emily Brown",
    price: 54.99,
    rating: 4.6,
    description: "Introduction to data science fundamentals. Learn data analysis, visualization, and basic statistical concepts.",
    topics: ["Python", "Data Analysis", "Statistics", "Data Visualization", "Machine Learning Basics"],
    duration: "14 weeks",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Mobile App Development",
    icon: Laptop,
    students: 456,
    level: "Intermediate",
    tutor: "Michael Lee",
    price: 69.99,
    rating: 4.4,
    description: "Learn to build mobile applications for iOS and Android using React Native. Create cross-platform apps efficiently.",
    topics: ["React Native", "Mobile UI/UX", "App State Management", "Native APIs", "App Publishing"],
    duration: "12 weeks",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Artificial Intelligence Ethics",
    icon: Book,
    students: 1089,
    level: "Advanced",
    tutor: "Sarah Wilson",
    price: 89.99,
    rating: 4.7,
    description: "Explore ethical considerations in AI development. Learn about bias, fairness, transparency, and responsible AI practices.",
    topics: ["AI Ethics", "Bias in AI", "Responsible AI", "Privacy", "Social Impact"],
    duration: "8 weeks",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
]



const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

const Input = ({ type, value, onChange, placeholder, className }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-2 text-lg w-full rounded-md text-black ${className}`}
    />
  )
}

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-400">({rating.toFixed(1)})</span>
    </div>
  )
}

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

const CoursePreview = ({ course, onClose, onAddToCart }) => {
  return (
    <div className="space-y-6">
      <img
        src={course.image}
        alt={course.name}
        className="w-full h-64 object-cover rounded-lg"
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{course.name}</h2>
          <course.icon className="w-8 h-8 text-purple-400" />
        </div>
        <p className="text-gray-400">{course.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Course Details</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Duration: {course.duration}</li>
              <li>Level: {course.level}</li>
              <li>Students: {course.students.toLocaleString()}</li>
              <li>Instructor: {course.tutor}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">What You'll Learn</h3>
            <ul className="space-y-2 text-gray-400">
              {course.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div>
            <p className="text-3xl font-bold text-purple-400">${course.price}</p>
            <StarRating rating={course.rating} />
          </div>
          <Button onClick={() => { onAddToCart(course); onClose(); }}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-700 rounded-lg text-left"
      >
        <span>{label}: {value || "All"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-gray-700 rounded-lg shadow-xl">
          <div className="py-1">
            <button
              onClick={() => {
                onChange("")
                setIsOpen(false)
              }}
              className="block w-full px-4 py-2 text-left hover:bg-gray-600"
            >
              All
            </button>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-600"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CourseRoom() {
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [currentlyPreviewing, setCurrentlyPreviewing] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <CourseRoomShimmer />;

  const addToCart = (course) => {
    const existingItem = cart.find((item) => item.course.id === course.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.course.id === course.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { course, quantity: 1 }])
    }
  }

  const removeFromCart = (courseId) => {
    setCart(cart.filter((item) => item.course.id !== courseId))
  }

  const updateQuantity = (courseId, newQuantity) => {
    if (newQuantity < 1) return
    setCart(
      cart.map((item) =>
        item.course.id === courseId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const getPriceRange = (price) => {
    if (price < 60) return "Under $60"
    if (price < 80) return "$60 - $80"
    return "Over $80"
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tutor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = !selectedLevel || course.level === selectedLevel
    const matchesPriceRange = !priceRange || getPriceRange(course.price) === priceRange
    return matchesSearch && matchesLevel && matchesPriceRange
  })

  const cartTotal = cart.reduce(
    (total, item) => total + item.course.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4 px-8 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Course Room</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Courses</h2>
            <div className="flex space-x-4">
              <FilterDropdown
                label="Level"
                options={["Beginner", "Intermediate", "Advanced"]}
                value={selectedLevel}
                onChange={setSelectedLevel}
              />
              <FilterDropdown
                label="Price"
                options={["Under $60", "$60 - $80", "Over $80"]}
                value={priceRange}
                onChange={setPriceRange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20"
              >
                <div
                  className="relative pb-[56.25%] cursor-pointer"
                  onClick={() => setCurrentlyPreviewing(course)}
                >
                  <img
                    src={course.image}
                    alt={course.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{course.name}</h3>
                    <course.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-gray-400 mb-2">by {course.tutor}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">{course.level}</span>
                    <StarRating rating={course.rating} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-400">${course.price}</span>
                    <Button onClick={() => addToCart(course)} className="text-sm">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Modal
          isOpen={currentlyPreviewing !== null}
          onClose={() => setCurrentlyPreviewing(null)}
        >
          {currentlyPreviewing && (
            <CoursePreview
              course={currentlyPreviewing}
              onClose={() => setCurrentlyPreviewing(null)}
              onAddToCart={addToCart}
            />
          )}
        </Modal>

        <Modal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.course.id}
                    className="flex justify-between items-center pb-4 border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.course.image}
                        alt={item.course.name}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h3 className="font-bold">{item.course.name}</h3>
                        <p className="text-sm text-gray-400">{item.course.tutor}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.course.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-700 rounded-l"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.course.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-700 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple-400 font-bold mr-4">
                        ${(item.course.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        onClick={() => removeFromCart(item.course.id)}
                        className="text-sm bg-red-600 hover:bg-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-purple-400">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full">Proceed to Checkout</Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      </main>
    </div>
  )
}