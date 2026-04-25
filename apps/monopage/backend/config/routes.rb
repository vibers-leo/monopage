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
      resources :password_resets, only: [:create, :update], param: :token
      post 'notify', to: 'notifications#create'
      resources :user_notifications, path: 'notifications', only: [:index] do
        patch 'read', on: :member
        post 'read_all', on: :collection
      end

      # Super Admin — 다른 유저의 데이터 조회/수정
      namespace :admin do
        get 'profiles/:username', to: 'super#profile'
        get 'profiles/:username/links', to: 'super#links'
        get 'profiles/:username/portfolio_items', to: 'super#portfolio_items'
        get 'profiles/:username/inquiries', to: 'super#inquiries'
        patch 'profiles/:username', to: 'super#update_profile'
        get 'all_inquiries', to: 'super#all_inquiries'
        get 'all_profiles', to: 'super#all_profiles'
      end

      # Analytics (authenticated)
      get 'analytics', to: 'analytics#index'
      # Analytics (public - no auth)
      post 'analytics/view', to: 'analytics#track_view'
      post 'analytics/click', to: 'analytics#track_click'
    end
  end
end
