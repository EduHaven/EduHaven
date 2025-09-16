import { Github, Play, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-8 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto p-6 sm:p-12 mb-[150px] lg:mb-0">
          <h2 className="text-2xl sm:text-4xl font-semibold font-poppins mb-4 sm:mb-2">
            Ready to transform your learning journey?
          </h2>

          <p className="text-base sm:text-xl mb-8 sm:mb-12 txt-dim">
            Join thousands of students who are staying organized, motivated, and
            achieving their academic goals with EduHaven.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/auth/login")}
              variant="default"
              size="default"
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: "var(--btn)" }}
            >
              <Play size={20} />
              <span>Get Started for Free</span>
            </Button>

            <a
              href="https://github.com/Eduhaven/eduhaven"
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              style={{ borderColor: "var(--btn)", color: "var(--btn)" }}
            >
              <Github size={20} />
              <span>View on GitHub</span>
            </a>
          </div>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <div
              className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm"
              style={{ color: "var(--txt-dim)" }}
            >
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-green-500" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-green-500" />
                <span>Open source</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-green-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
