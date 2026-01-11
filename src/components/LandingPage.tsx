import { useNavigate } from 'react-router'
import { cn } from '../lib/utils'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">
            🎆 線上螢光棒 🎆
          </h1>
          <p className="text-2xl text-purple-200 font-medium">
            為演唱會和活動打造的數位螢光棒
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 space-y-6 text-left">
          <h2 className="text-2xl font-semibold text-white text-center mb-4">
            使用說明
          </h2>

          <div className="space-y-4 text-purple-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👆</span>
              <div>
                <p className="font-semibold">輕觸換色</p>
                <p className="text-sm text-purple-200">快速點擊螢幕即可切換螢光棒顏色</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-semibold">防止誤觸</p>
                <p className="text-sm text-purple-200">長按不會觸發換色（避免握持時誤觸）</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold">全螢幕模式</p>
                <p className="text-sm text-purple-200">自動進入全螢幕，獲得最佳體驗</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-semibold">螢幕常亮</p>
                <p className="text-sm text-purple-200">啟動後螢幕將保持開啟，不會自動熄滅</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📶</span>
              <div>
                <p className="font-semibold">離線可用</p>
                <p className="text-sm text-purple-200">安裝後無需網路即可使用</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className={cn(
            "w-full py-6 px-8 rounded-2xl",
            "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
            "hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600",
            "text-white text-2xl font-bold",
            "transform transition-all duration-200",
            "hover:scale-105 active:scale-95",
            "shadow-2xl hover:shadow-pink-500/50",
            "animate-pulse hover:animate-none"
          )}
        >
          開始使用 🎉
        </button>

        <p className="text-purple-300 text-sm">
          點擊按鈕後，將自動進入全螢幕模式並啟用螢幕常亮功能
        </p>
      </div>
    </div>
  )
}
