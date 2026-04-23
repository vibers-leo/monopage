Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post 'signup', to: 'auth#signup'
      post 'login', to: 'auth#login'
      post 'auth/kakao', to: 'social_auth#kakao'
      post 'auth/naver', to: 'social_auth#naver'
      post 'auth/google', to: 'social_auth#google'
      get  'auth/connections', to: 'social_auth#connections'
      delete 'auth/connections', to: 'social_auth#disconnect'

      resource :profile, only: [:show, :update, :destroy] do
        put 'password', to: 'profiles#change_password'
      end
      get 'profiles/:username', to: 'profiles#public_show'
      resources :links, only: [:index, :create, :update, :destroy] do
        post 'reorder', on: :collection
      end
      resources :portfolio_items, only: [:index, :create, :update, :destroy] do
        post 'reorder', on: :collection
      end
      resources :social_accounts, only: [:index, :create, :destroy] do
        get 'sync', on: :member
      end

      resources :inquiries, only: [:index, :create, :update, :destroy] do
        get 'stats', on: :collection
      end

      # Analytics (authenticated)
      get 'analytics', to: 'analytics#index'
      # Analytics (public - no auth)
      post 'analytics/view', to: 'analytics#track_view'
      post 'analytics/click', to: 'analytics#track_click'
    end
  end
end
