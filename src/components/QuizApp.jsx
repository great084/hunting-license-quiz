'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function QuizApp() {
  const [species, setSpecies] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answer, setAnswer] = useState({ isHuntable: null, speciesName: '' })
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  // データ読み込み
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/species_data.json')
        const data = await res.json()
        setSpecies(data.species)
        loadRandomQuestion(data.species)
      } catch (error) {
        console.error('Failed to load species data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const loadRandomQuestion = (speciesList) => {
    const random = speciesList[Math.floor(Math.random() * speciesList.length)]
    setCurrentQuestion(random)
    setAnswer({ isHuntable: null, speciesName: '' })
    setShowResult(false)
  }

  const handleSubmit = () => {
    if (currentQuestion === null) return

    const correct =
      answer.isHuntable === currentQuestion.is_huntable &&
      (currentQuestion.is_huntable === false || answer.speciesName === currentQuestion.species_name)

    setIsCorrect(correct)
    setShowResult(true)
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }))
  }

  const handleNext = () => {
    loadRandomQuestion(species)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>
  }

  if (!currentQuestion) {
    return <div className="flex items-center justify-center min-h-screen">データを読み込んでいます...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">狩猟鳥獣クイズ</h1>
          <p className="text-gray-600">正しく判定できますか？</p>
          {score.total > 0 && (
            <p className="text-lg font-semibold text-blue-600 mt-2">
              スコア: {score.correct}/{score.total}
            </p>
          )}
        </div>

        {/* クイズカード */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* 画像 */}
          <div className="relative w-full mb-6 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: '300px' }}>
            <Image
              src={`/images/${currentQuestion.is_huntable ? 'huntable' : 'non-huntable'}/${currentQuestion.filename}`}
              alt="狩猟鳥獣クイズ"
              width={400}
              height={400}
              className="object-contain"
              priority
            />
          </div>

          {/* 質問と入力 */}
          <div className="space-y-4">
            {/* 狩猟対象判定 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                狩猟対象ですか？
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAnswer(prev => ({ ...prev, isHuntable: false }))}
                  className={`flex-1 py-2 px-4 rounded font-semibold transition ${
                    answer.isHuntable === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={showResult}
                >
                  対象外
                </button>
                <button
                  onClick={() => setAnswer(prev => ({ ...prev, isHuntable: true }))}
                  className={`flex-1 py-2 px-4 rounded font-semibold transition ${
                    answer.isHuntable === true
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={showResult}
                >
                  対象
                </button>
              </div>
            </div>

            {/* 狩猟対象の場合、種別名入力 */}
            {answer.isHuntable === true && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  種別名を入力してください
                </label>
                <input
                  type="text"
                  value={answer.speciesName}
                  onChange={(e) => setAnswer(prev => ({ ...prev, speciesName: e.target.value }))}
                  placeholder="例: キジ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={showResult}
                />
              </div>
            )}
          </div>

          {/* 結果表示 */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'}`}>
              <p className={`font-bold text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '✓ 正解！' : '✗ 不正解'}
              </p>
              <div className="mt-2 text-sm text-gray-700">
                <p><strong>狩猟対象：</strong> {currentQuestion.is_huntable ? 'はい' : 'いいえ'}</p>
                <p><strong>種別名：</strong> {currentQuestion.species_name}</p>
              </div>
            </div>
          )}

          {/* ボタン */}
          <div className="mt-6 flex gap-2">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={answer.isHuntable === null || (answer.isHuntable === true && answer.speciesName === '')}
                className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                答える
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
              >
                次の問題
              </button>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>資料免許試験対策アプリ</p>
        </div>
      </div>
    </div>
  )
}
