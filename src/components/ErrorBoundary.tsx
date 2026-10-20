import { Component, ErrorInfo, ReactNode } from 'react';
import { PakPeca } from './PakPeca';
import { TombolChunky } from './TombolChunky';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in MONOPECA:', error, errorInfo);
  }

  private handlePulihkan = () => {
    // Reset state & reload
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-8 shadow-soft-card flex flex-col items-center">
            <PakPeca ekspresi="bingung" size={130} />
            <h1 className="text-3xl font-display font-extrabold text-[#1E2149] mt-4 mb-2">
              Ups, Ada Sedikit Kendala!
            </h1>
            <p className="text-base font-bold text-gray-700 leading-relaxed mb-6">
              Jangan panik ya! Data permainanmu tersimpan dengan aman di penyimpanan lokal. Tekan tombol di bawah untuk memulihkan permainan.
            </p>
            <TombolChunky
              variant="primary"
              size="lg"
              icon={<RotateCcw className="w-6 h-6" />}
              onClick={this.handlePulihkan}
            >
              Pulihkan Permainan
            </TombolChunky>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
